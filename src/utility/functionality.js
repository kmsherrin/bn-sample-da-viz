const stateAbbr = ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'ACT', 'NT'];
const POSTCODE_MATCH = {
    2: 'NSW',
    3: 'VIC',
    4: 'QLD',
    5: 'SA',
    6: 'WA',
    7: 'TAS'
}

/** 
postcodeParse takes in an Australian postcode and returns the state abbr, 
as a fallback it takes in the original entered state, and returns that if the
postcode is not found.
*/
const postcodeParse = (postcode, originalState) => {
    let postcodeState = undefined;

    /* First check if the postcode is an edge case one */
    if (postcode.slice(0, 2) === '26' || postcode.slice(0, 2) === '29' || postcode.slice(0, 0) === '0') {
        let integerPostcode = parseInt(postcode);

        if (integerPostcode > 2600 && integerPostcode < 2618) {
            postcodeState = 'ACT';
        } else if (integerPostcode > 2900 && integerPostcode < 2999) {
            postcodeState = 'ACT';
        } else if (integerPostcode > 800 && integerPostcode < 999) {
            postcodeState = 'NT';
        }

    } else {
        /* Else: here we have a standard post code, match it with the object */
        postcodeState = POSTCODE_MATCH[postcode.slice(0, 1)];
    }

    /* Last ditch effort in the hope they input their state correctly :) */
    if (postcodeState === undefined) {
        if (stateAbbr.includes(originalState.toUpperCase())) {
            postcodeState = originalState.toUpperCase();
        }
    }

    return postcodeState;
}
/**
splits the full product/flavour string into separate strings
*/
const computeProductAndFlavour = (name) => {
    /* Determine the product and its flavour (if it has one) */
    let split_name = name.split(' - ')
    return ({ product: split_name[0], flavour: split_name.length > 1 ? split_name[1] : null })
}

/*
This is a very simple method (and naive) method for checking duplicate entries.
Logic is assuming a person would not be making more than 1 request in a 6 hour period,
if they have it is unintentional should be flagged. The logic also assumes that the second
request flavour is what they are after, so only the first request is flagged.
*/
const computeDuplicate = (row, index, data) => {

    let duplicate = false;
    // Get the current time of this row
    let current_time = new Date(row.Date);

    /* Iterate through the data array (from this index onwards) to check if
    there is another entry within the 6 hour time window */
    data.slice(index + 1).forEach((row2, index2) => {
        let next_row_time = new Date(row2.Date);

        // 21600000 is 6 hours in milliseconds
        if ((next_row_time.getTime() - current_time.getTime()) > 21600000) {
            return;
        } else {
            /* Make the comparison to first name last name. Not checking flavour because
            they may have changed their mind? 🤷‍♂️ */
            if (row.LastName === row2.LastName && row.FirstName === row2.FirstName) {
                duplicate = true;
            };
        };
    });

    return duplicate;
}

/**
Rudimentary method for sorting based on the selected method,
this should be genericised so that the ifs are not repeated in the code
*/
const sortProducts = (array, method) => {
    if (method === 'most') {
        return array.sort((a, b) => (a.count < b.count ? 1 : -1));
    } else if (method === 'least') {
        return array.sort((a, b) => (a.count > b.count ? 1 : -1));
    } else if (method === 'az') {
        return array.sort((a, b) => (a.product > b.product ? 1 : -1));
    } else if (method === 'za') {
        return array.sort((a, b) => (a.product < b.product ? 1 : -1));
    }
}

export { computeProductAndFlavour, postcodeParse, computeDuplicate, sortProducts };