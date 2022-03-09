import { computeProductAndFlavour, postcodeParse, computeDuplicate, sortProducts } from './utility/functionality';
import { useEffect, useState } from 'react';
import './App.css';

import BarChartComponent from './components/BarChart';
import ProductCard from './components/ProductCard';
import FilterOptions from './components/FilterOptions';

function App() {

  const dow = { 0: 'Sunday', 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday', 6: 'Saturday' };

  const [rawData, setRawData] = useState(undefined);

  const [fullData, setFullData] = useState(undefined);
  const [workingData, setWorkingData] = useState(undefined);
  const [filteredWorkingData, setFilteredWorkingData] = useState(undefined);

  const [shownProductCountsArray, setShownProductCountsArray] = useState([]);

  const [stateChartData, setStateChartData] = useState(undefined);
  const [dayOfWeekChartData, setDayOfWeekChartData] = useState(undefined);

  const [productListing, setProductListing] = useState(undefined);

  const [states, setStates] = useState([]);

  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const [endIndex, setEndIndex] = useState(6);

  const [productFilters, setProductFilters] = useState([]);
  const [stateFilters, setStateFilters] = useState([]);

  const [sortMethod, setSortMethod] = useState('most')

  useEffect(() => {
    // Initial startup - fetch the required data
    const rawDataFetch = async () => {

      /* 
      If you are having problems, please replace the process.env.bn_api_path with the actual URL
      i.e. https://secure.website.com.au/content/data.json (obviously replace with the right one)

      To use this you will need to set a system/user environment variable
      i.e. export export REACT_APP_BN_API_PATH=https://secure.website.com.au/content/data.json
      or set REACT_APP_BN_API_PATH=https://secure.website.com.au/content/data.json
      */
      let url = process.env.REACT_APP_BN_API_URL;
      let response = await fetch(url);
      let data = await response.json();
      setRawData(data);
    }
    rawDataFetch();
  }, [])

  /* 
  Overview is that one useEffect runs after data fetch to do an initial parsing
  and clean up of the data. A second useEffect is tied to the updating of the cleaned
  data state and runs once that variable has been updated. The second useEffect is 
  just restructuring the data a little bit for displaying it in the UI
  */
  useEffect(() => {
    // Do nothing if we haven't yet actually fetched some data
    if (rawData === undefined) {
      return
    };

    let dateSortedData = rawData.sort((a, b) => (new Date(a.Date) > new Date(b.Date) ? 1 : -1));

    // We can record the start and end times of the dataset
    setStartTime(new Date(dateSortedData[0].Date).toDateString());
    setEndTime(dateSortedData[dateSortedData.length - 1].Date);

    // productList will be used to store the unique products as keys
    let productListing = {};
    let states = [];

    dateSortedData.forEach((row, index) => {

      // Parse the postcode first, add it to the row
      row.postcodeState = postcodeParse(row.Postcode, row.State);

      // Push the states available, we'll use this to build the state filters
      if (!states.includes(row.postcodeState)) {
        states.push(row.postcodeState);
      }

      // Split the product and flavour apart
      let productParsed = computeProductAndFlavour(row.Sample);
      row.product = productParsed.product;
      row.flavour = productParsed.flavour;

      // Create an object with keys associated with each product
      if (productListing[row.product] === undefined) {
        productListing[row.product] = [];
      }
      // Put in the flavours under the key of the product
      if (!productListing[row.product].includes(row.flavour)) {
        productListing[row.product].push(row.flavour);
      }

      // Turn the entry date into a day of the week
      row.dayOfWeek = new Date(row.Date).getDay();

      // Determine if a particular entry is a duplicate
      row.duplicate = computeDuplicate(row, index, dateSortedData);

    });

    // Apply the states (bad name) so the filter cboxes can be built
    setStates(states);

    // Set the product listing, the product filters will be built from this
    setProductListing(productListing);

    // Create a new array of objects with only the unique entries
    let onlyUniques = dateSortedData.filter(row => row.duplicate === false);
    setWorkingData(onlyUniques);

    // filteredWorkingData is set so that the view can be rendered
    setFilteredWorkingData(onlyUniques);

    // Keep the original data in state, incase we need to reset it
    setFullData(dateSortedData);

  }, [rawData])

  /*
  The following useEffect is called each time filteredWorkingData is set,
  i.e. after filters are changed and applied. The bulk of this function setups up
  more usable data structures and sets state along the way

  There are a number of things in here that could be cleaned up and simplified,
  if I had some more time that would be a priority ....
  */
  useEffect(() => {
    // Lets rejig the data so that it is in a better format for handling
    if (filteredWorkingData !== undefined) {

      let productCounts = {};
      let stateCounts = {};
      let postcodeCounts = {};

      let productsPerState = {};

      // Iterate through the filteredWorkingData, here we will complete product counts all in one go
      for (let purchase in filteredWorkingData) {
        let row = filteredWorkingData[purchase];

        if (productsPerState[row.Sample] === undefined) {
          productsPerState[row.Sample] = {};
        }

        productCounts[row.Sample] = productCounts[row.Sample] ? productCounts[row.Sample] + 1 : 1;
        productsPerState[row.Sample][row.postcodeState] = productsPerState[row.Sample][row.postcodeState] ? productsPerState[row.Sample][row.postcodeState] + 1 : 1;
        stateCounts[row.postcodeState] = stateCounts[row.postcodeState] ? stateCounts[row.postcodeState] + 1 : 1;
        postcodeCounts[row.Postcode] = postcodeCounts[row.Postcode] ? postcodeCounts[row.Postcode] + 1 : 1;
      }

      /* 
      Lets structure this into an array where each element is an object
      with all the important product info
      */
      let productCountsArray = [];
      Object.keys(productCounts).forEach(key => {
        let productParsed = computeProductAndFlavour(key);
        productCountsArray.push({
          productFull: key,
          product: productParsed.product,
          flavour: productParsed.flavour,
          count: productCounts[key],
          stateData: productsPerState[key],
          rowData: workingData.filter(row => row.Sample === key)
        })
      })

      // Sort this according to the current method
      let productCountsArraySorted = sortProducts(productCountsArray, sortMethod);

      // Shown is used so that we can cut back on the number of product cards shown
      setShownProductCountsArray(productCountsArraySorted);


      /* Pull out and structure the data for the by-state chart */
      let state_labels = Object.keys(stateCounts);
      let stateChartData = [];
      state_labels.forEach((label, index) => {
        stateChartData.push({
          label: label,
          count: stateCounts[label]
        })
      });

      setStateChartData(stateChartData);

      /* Pull out and structure the data for the by-state chart */
      let dow_keys = Object.keys(dow);
      let dowChartData = [];
      dow_keys.forEach((key, index) => {
        // Turn them to integers just to be sure - ts sure would be great :)
        let count = filteredWorkingData.filter(row => parseInt(row.dayOfWeek) === parseInt(key)).length
        dowChartData.push({
          label: dow[key],
          count: count
        })
      });
      setDayOfWeekChartData(dowChartData);

    }
  }, [filteredWorkingData])

  const applyFilters = () => {
    // Get the original working data
    let data = workingData;

    if (productFilters.length > 0) {
      data = data.filter(row => productFilters.includes(row.product));
    }

    if (stateFilters.length > 0) {
      data = data.filter(row => stateFilters.includes(row.postcodeState));
    }
    setFilteredWorkingData(data);
  }

  /* Here we handle the product checkbox filtering */
  const handleProductCheckboxFilter = (event) => {
    if (event.target.checked) {
      setProductFilters(prevState => [...prevState, event.target.value])

    } else {
      let removed = productFilters.filter(x => x !== event.target.value);
      setProductFilters(removed)
    }
  }

  const handleStateCheckboxFilter = (event) => {

    if (event.target.checked) {
      setStateFilters(prevState => [...prevState, event.target.value])

    } else {
      let removed = stateFilters.filter(x => x !== event.target.value);
      setStateFilters(removed)
    }
  }

  return (
    <div className="App">
      <header className="App-header gradient-background" style={{ scrollSnapAlign: 'start' }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ margin: "2rem" }}>Bulk Nutrients Samples Requested</h1>
          <h4 style={{ margin: "2rem" }}>From {new Date(startTime).toDateString()} to {new Date(endTime).toDateString()} </h4>
          <h6>A short attempt at providing a visual representation of the samples requested.</h6>
          <small>- Kendall 👨‍💻</small>
        </div>
      </header>

      <section name="data-ui" className="App-header">
        <h2 style={{ margin: "2rem" }}>Requested Samples</h2>
        <div className="container" name="grid-container">

          <aside className="left">
            <div className="left-container border-style">
              <h3> Filters </h3>
              <div className="filters-container">
                <h5>
                  Product
                </h5>
                <div name="product-filter-checkboxes" style={{ textAlign: "left" }}>
                  {
                    productListing !== undefined ? (
                      <FilterOptions
                        inputArray={Object.keys(productListing)}
                        checkboxHandler={handleProductCheckboxFilter}
                        testid={'product-filter'}
                      >
                      </FilterOptions>
                    ) : (
                      <h6 data-testid="product-filter-none-found">No products found</h6>
                    )
                  }
                </div>
              </div>

              <div className="filters-container">
                <h5> State </h5>
                <div name="state-filter-checkboxes" style={{ textAlign: "left"}}>
                  {
                    states.length > 0 ? (
                      <FilterOptions
                        inputArray={states.sort()}
                        checkboxHandler={handleStateCheckboxFilter}
                        testid={'state-filter'}
                      >
                      </FilterOptions>
                    ) : (
                      <h6 data-testid="state-filter-none-found">No states found</h6>
                    )
                  }
                </div>
              </div>

              <div>
                <button className="bn-button" onClick={() => applyFilters()}>
                  Apply Filters
                </button>
              </div>

            </div>
          </aside> {/* end of left */}


          <main className="middle">
            <div className="data-container">

              <div className="popular border-style">
                <div style={{ display: "flex", justifyContent: "end", margin: "1rem 0.2rem" }}>
                  <h6 style={{ margin: "0 1rem" }}>
                    Sort by:
                  </h6>
                  <select className="bn-select" onChange={(e) => setSortMethod(e.target.value)}>
                    <option value="most">Most Popular</option>
                    <option value="least">Least Popular</option>
                    <option value="az">A - Z</option>
                    <option value="za">Z - A</option>
                  </select>
                </div>
                {/* This is the products scroll display*/}
                <div className="products-grid-container" style={{ maxHeight: '800px', overflowY: "auto" }}>
                  {
                    shownProductCountsArray.length > 0 ? (
                      shownProductCountsArray.slice(0, endIndex).map((row, index) => {
                        return (
                          <ProductCard
                            product={row.product}
                            flavour={row.flavour}
                            count={row.count}
                            key={index}
                          >
                          </ProductCard>
                        )
                      })
                    ) : (<h5 style={{ margin: "1rem" }} data-testid="no-results"> No results found for those filters</h5>)
                  }
                </div>

                <div>
                  {
                    shownProductCountsArray.length > endIndex ? (
                      <button className="bn-button" data-testid="show-more-button" onClick={() => setEndIndex(endIndex + 6)}>
                        Show More
                      </button>
                    ) : (
                      null
                    )
                  }
                </div>
              </div>

              <figure className="state border-style">
                <h6 style={{ margin: "0.5rem 0" }}>Number of samples by state</h6>
                <BarChartComponent
                  title={'Number of samples by state'}
                  data={stateChartData}
                />
              </figure>

              <figure className="dayofweek border-style">
                <h6 style={{ margin: "0.5rem 0" }}>Number of samples by day of week</h6>
                <BarChartComponent
                  title={'Number of samples by day of week'}
                  data={dayOfWeekChartData}
                />
              </figure>

              <div className="duplicates border-style">
                <div>
                  <h6 style={{ margin: "0.5rem 0" }}>Total requests</h6>
                  <h5>{fullData !== undefined ? fullData.length : ""}</h5>
                </div>
                <div>
                  <h6 style={{ margin: "0.5rem 0" }}>Overall duplicates</h6>
                  <h5>{workingData !== undefined && fullData !== undefined ? fullData.length - workingData.length : ""}</h5>
                </div>
              </div>

            </div> {/* end of data-container */}
          </main> {/* end of middle */}
          <div className="right">

          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
