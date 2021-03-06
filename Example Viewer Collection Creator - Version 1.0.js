// Show custom menu in title nav bar - 'Example Viewer Menu' - with sub menu item 'Output Full Collection To Screen'
function onOpen() {
    SpreadsheetApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
        .createMenu('Example Viewer Menu')
        .addItem('Output Full Collection To Screen', 'iterateTable')
        .addToUi();
}

// Function loops/grabs info from table - initiated with 'Output Full Collection To Screen' from custom menu
function iterateTable() {

    // Initiate output display for Users 
    let ui = SpreadsheetApp.getUi();

    // Get data from current sheet
    let sheet = SpreadsheetApp.getActiveSheet();
    let data = sheet.getDataRange().getValues();

    // Declared empty array to collect and collate each iterated item result
    let myFinalArray = [];

    let abuseType = data[0][0]; // abuse type
    let marketName = data[0][6]; // market

    // Loop through each row & assign variable names to output for each required cell
    for (let i = 4; i < data.length; i++) {

        let imageID = data[i][1]; //ID (not object ID - UNUSED FOR NOW)

        let subViolation = data[i][2]; //topic

        let difficultyLevel = data[i][3]; //difficulty level
        let latestDate = data[i][4]; //ds

        // CAPTION    
        // Declare empty first - have tried all other ways to do this - this one only works in gApp script - TBC
        let captionField = '';
        // Test to see if cell is empty - if empty do not include the attribute in output
        if (data[i][5]) {
            captionField = `caption="${data[i][5]}"`; //caption
        }

        // TRANSLATION    
        // Declare empty first - have tried all other ways to do this - this one only works in gApp script - TBC
        let translationField = '';
        // Test to see if cell is empty - if empty do not include the attribute in output
        if (data[i][6]) {
            translationField = `translation="${data[i][6]}"`; //translation
        }

        let decisionString = data[i][7];
        let decisionAction = data[i][8];
        let reasonField = data[i][9];
        let keywordsField = data[i][10];

        // BLUR    
        let blur = '';

        // test to see if cell is empty - if empty do not include the attribute in output
        if (data[i][11] === true) {
            blur = `blur="true"`;
        }
        //Media group/object ID of photo, as uploaded to CMS - 
        //FOR USERS - THIS SHOULD BE ADDED BEFORE SCRIPT IS RUN, AND IF NOT A PLACEHOLDER IMAGE IS ADDED
        let imageGroupID = data[i][12];
        if (!imageGroupID) {
            imageGroupID = '263109918206505'; //Placeholder Image Group ID
        }

        // Template literal collating current row of cells into desired formatted output
        let thisResult =
            `
      <!-- Example No: ${i - 3} -->
        <training-example-viewer-item
        
      id="${imageID}"
      abuse-type="${abuseType}"
      market="${marketName}"
      topic="${subViolation}"
      ds="${latestDate}"
      ${captionField}
      ${translationField}     
      difficulty="${difficultyLevel}"                   
      decision="${decisionAction}"
      decision-string="${decisionString}"
      keywords="${keywordsField}"
      ${blur}
      group="${imageGroupID}"
      
      >${reasonField}
      </training-example-viewer-item>
      `;

        // To avoid outputting empty items, only run iteration if these cells (B,C,D) contain data
        if (imageID, subViolation, difficultyLevel) {

            // Push each example item to array on each iteration in loop
            myFinalArray.push(thisResult);
        }
    }

    // Remove commas after every example, convert array to string and replace neccessary strings
    let myFinalArrayReplacedStr = myFinalArray.join('').toString().replace(/&/gi, '&amp;');

    // Containing code that's required, added here, to wrap the final complete iteration of sheet
    let result =
        `
    <srt-policy>
      <meta name="market">${marketName}</meta>
      <meta name="violationType">${abuseType}</meta>
      <meta name="documentType">ev</meta>          
      ${myFinalArrayReplacedStr}
    </srt-policy>
    
    `
        // Alert final output and formatted code to screen
    ui.alert(result);

    //Logger.log(result); // Kept for future testing & maintenance purposes

}