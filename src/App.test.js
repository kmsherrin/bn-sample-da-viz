import { fireEvent, render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import App from './App';

let mockSampleData = [
    {
      "Date": "2021-08-01T00:25:32Z",
      "FirstName": "Michael",
      "LastName": "Caldwell",
      "Postcode": "4560",
      "Sample": "BCAA Recovery - Wild Berry Flavour",
      "State": "Queensland"
    },
    {
      "Date": "2021-08-01T00:30:45Z",
      "FirstName": "Ben",
      "LastName": "Samuel",
      "Postcode": "3195",
      "Sample": "WPC - Chocolate Flavour",
      "State": "VIC"
    },
    {
      "Date": "2021-08-01T01:18:24Z",
      "FirstName": "Jamie",
      "LastName": "Smith",
      "Postcode": "4076",
      "Sample": "Future Whey - Lemonade Flavour",
      "State": "Qld"
    },
    {
      "Date": "2021-08-01T01:29:57Z",
      "FirstName": "Sharna",
      "LastName": "Leith",
      "Postcode": "5163",
      "Sample": "Protein Matrix+ - Salted Caramel Flavour",
      "State": "Sa"
    },
    {
      "Date": "2021-08-01T01:33:25Z",
      "FirstName": "Anita",
      "LastName": "Friffy",
      "Postcode": "1585",
      "Sample": "Red Fusion",
      "State": "NSW"
    },
    {
      "Date": "2021-08-01T01:47:29Z",
      "FirstName": "Anissa",
      "LastName": "Foyle",
      "Postcode": "2168",
      "Sample": "Earth Protein - Salted Caramel Flavour",
      "State": "NSW"
    },
    {
      "Date": "2021-08-01T02:02:09Z",
      "FirstName": "Kevin",
      "LastName": "Doherty",
      "Postcode": "2162",
      "Sample": "Total Meal Replacement - Chocolate Flavour",
      "State": "NSW"
    },
    {
      "Date": "2021-08-01T02:12:37Z",
      "FirstName": "Naomi",
      "LastName": "Schultz",
      "Postcode": "4217",
      "Sample": "Protein Matrix+ - Chocolate Flavour",
      "State": "Qld"
    },
    {
      "Date": "2021-08-01T02:14:41Z",
      "FirstName": "Victoria",
      "LastName": "Schultz",
      "Postcode": "4217",
      "Sample": "Total Meal Replacement - Vanilla Caramel Flavour",
      "State": "Qld"
    },
    {
      "Date": "2021-08-01T03:11:44Z",
      "FirstName": "David",
      "LastName": "Lazenby",
      "Postcode": "4020",
      "Sample": "WPI - Strawberry Flavour",
      "State": "Qld"
    },
    {
      "Date": "2021-08-01T03:17:22Z",
      "FirstName": "Sasha",
      "LastName": "Westmore",
      "Postcode": "2784",
      "Sample": "WPI - Choc Honeycomb Flavour",
      "State": "Nsw"
    },
    {
      "Date": "2021-08-01T03:41:42Z",
      "FirstName": "Rebecca",
      "LastName": "Holowczak",
      "Postcode": "3156",
      "Sample": "WPI - Cookies & Cream Flavour",
      "State": "VIC"
    },
    {
      "Date": "2021-08-01T04:05:32Z",
      "FirstName": "Kristian",
      "LastName": "Hopkins",
      "Postcode": "6101",
      "Sample": "BCAA Recovery - Lemonade Flavour",
      "State": "WA"
    },
    {
      "Date": "2021-08-01T05:04:59Z",
      "FirstName": "Adam",
      "LastName": "Polmear",
      "Postcode": "3083",
      "Sample": "MuscleFood 101 - Cookies & Cream Flavour",
      "State": "Victoria"
    },
    {
      "Date": "2021-08-01T05:11:50Z",
      "FirstName": "Stephanie",
      "LastName": "Hayes",
      "Postcode": "3201",
      "Sample": "Protein Matrix+ - Vanilla Flavour",
      "State": "Victoria"
    },
    {
      "Date": "2021-08-01T06:15:32Z",
      "FirstName": "Matthew",
      "LastName": "Beukers",
      "Postcode": "4101",
      "Sample": "Red Fusion",
      "State": "QLD"
    },
    {
      "Date": "2021-08-01T06:27:40Z",
      "FirstName": "Julie",
      "LastName": "Laube",
      "Postcode": "6168",
      "Sample": "Thermowhey - Vanilla Maple Flavour",
      "State": "Western Australia"
    },
    {
      "Date": "2021-08-01T06:43:59Z",
      "FirstName": "Renee",
      "LastName": "Lacey",
      "Postcode": "2330",
      "Sample": "Protein Matrix+ - Chocolate Flavour",
      "State": "Nsw"
    },
    {
      "Date": "2021-08-01T07:05:30Z",
      "FirstName": "Kinnon",
      "LastName": "Wlson",
      "Postcode": "4881",
      "Sample": "Protein Matrix+ - Chocolate Flavour",
      "State": "Qld"
    },
    {
      "Date": "2021-08-01T07:06:14Z",
      "FirstName": "Kinnon",
      "LastName": "Wlson",
      "Postcode": "4881",
      "Sample": "Earth Meal - Chocolate Flavour",
      "State": "Qld"
    }
]

// I am silly and forgot to setup a scaffold to help the fetches work :)
const renderAppScaffold = () => {
  render (
      <App testData={mockSampleData}/>
  )
}


test('renders main hero text', () => {
  renderAppScaffold();

  const heroText = screen.getByText(/bulk nutrients samples/i);
  expect(heroText).toBeInTheDocument();
});

test('product filters generate', async () => {
  renderAppScaffold();
  const productFilters = screen.getAllByTestId(/product-filter/i);
  expect(productFilters.length > 0).toBe(true);
});

test('state filters generate', async () => {
  renderAppScaffold();
  const productFilters = screen.getAllByTestId(/state-filter/i);
  expect(productFilters.length > 0).toBe(true);
})

test('product scroll list generate', async () => {
  renderAppScaffold();
  const productFilters = screen.getAllByTestId(/product-card/i);
  expect(productFilters.length === 6).toBe(true);
})

test('show more button rendered', async () => {
  renderAppScaffold();
  const showMoreButton = screen.getByTestId(/show-more-button/i);  
  expect(showMoreButton).toBeInTheDocument();
});

test('product scroll list has more results', async () => {
  renderAppScaffold();
  // Find show more button 
  const showMoreButton = screen.getByTestId(/show-more-button/i);
  fireEvent.click(showMoreButton);

  const productFilters = screen.getAllByTestId(/product-card/i);
  expect(productFilters.length === 12).toBe(true);
})