const STORE = [ 'AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY' ];

const apiKey = '6gQdCzoTyEXSeslbksMlbPEawPYYMq4Sls069lf8';
const searchURL = 'https://developer.nps.gov/api/v1/parks'


function watchForm() {
    $('.form-container').on('submit', '.search-form', getParks );    
}



function getParks() {
    event.preventDefault();
    let state = $('.input-state').val().replace(/\s+/g, '');
    let maxNum = $('.input-resultNum').val();        
    const params = {
        api_key: apiKey,
        stateCode: state,
        limit: maxNum,       
    }

    const queryString = formatQueryParams(params);
    const url = searchURL + '?' + queryString;
    
    fetch(url)
    .then(response => {      
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayParks(responseJson)) 
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function formatQueryParams(params) {
    queryItems = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);    
    return queryItems.join('&');

}

function displayParks(responseJson) {    
    let sectionHtml = ""
    if (responseJson.data.length > 0) {        
        for (let park in responseJson.data) {
            sectionHtml +=`
                <div class="result">
                    <h2>${responseJson.data[park].fullName}</h2>
                    <p>${responseJson.data[park].description}</p>
                    <a href="${responseJson.data[park].url}">${responseJson.data[park].url}</a>
                </div>
                <hr class="bar">`
        }
        $('.results-display').html(sectionHtml);
        $('section').removeClass('hidden');
    } else {
    $('.results-display').html(`
                <div class="result invalid-text">
                    <h2>The search returned 0 results. Make sure you entered a valid US state abbreviation.</h2>                    
                </div>`)
    }
}


$(watchForm);