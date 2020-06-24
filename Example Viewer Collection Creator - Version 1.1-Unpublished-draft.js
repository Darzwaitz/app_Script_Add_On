//Example Viewer Collection Creator - Version 1.1
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

    //added replace methods to all neccessary data fields
    let abuseType = data[1][0].replace(/&/gi, '&amp;').replace(/"/gi, '&quot;'); // abuse type
    let marketName = data[1][3].replace(/&/gi, '&amp;').replace(/"/gi, '&quot;'); // market


    // Loop through each row & assign variable names to output for each required cell
    for (let i = 5; i < data.length; i++) {

        let imageID = data[i][1]; //ID (not object ID - UNUSED FOR NOW)

        let subViolation = data[i][2]; //topic

        let difficultyLevel = data[i][3]; //difficulty level
        let latestDate = data[i][4]; //ds



        // CAPTION    
        // Declare empty first - have tried all other ways to do this - this one only works in gApp script - TBC
        let captionField = '';
        // Test to see if cell is empty - if empty do not include the attribute in output
        if (data[i][5]) {

            //added replace methods to all neccessary data fields
            let replacedCaptionField = data[i][5].replace(/&/gi, '&amp;').replace(/"/gi, '&quot;');

            captionField = `caption="${replacedCaptionField}"`; //caption
        }

        // TRANSLATION    
        // Declare empty first - have tried all other ways to do this - this one only works in gApp script - TBC
        let translationField = '';
        // Test to see if cell is empty - if empty do not include the attribute in output
        if (data[i][6]) {
            //filter unwanted symbols and replace with html codes
            let replacedTranslationField = data[i][6].replace(/&/gi, '&amp;').replace(/"/gi, '&quot;');
            translationField = `translation="${replacedTranslationField}"`; //translation
        }

        let decisionString = data[i][7];
        let decisionAction = data[i][8].replace(/&/gi, '&amp;').replace(/"/gi, '&quot;');
        let reasonField = data[i][9].replace(/&/gi, '&amp;').replace(/"/gi, '&quot;');
        let keywordsField = data[i][10].replace(/&/gi, '&amp;').replace(/"/gi, '&quot;');

        // BLUR    
        let blur = '';

        // test to see if cell is empty - if empty do not include the attribute in output
        if (data[i][11] === true) {
            blur = `blur="true"`;
        }
        //Media group/object ID of photo, as uploaded to CMS - 
        //FOR USERS - THIS SHOULD BE ADDED BEFORE SCRIPT IS RUN, AND IF NOT A PLACEHOLDER IMAGE IS ADDED
        let imageGroupID = data[i][12];
        // ADDED new conditional to check if this field is empty
        //OLD CODE - kept for future testing
        //if (!imageGroupID) {
        // imageGroupID = '263109918206505'; //Placeholder Image Group ID
        //}

        // Template literal collating current row of cells into desired formatted output
        let thisResult =
            `
      <!-- Example No: ${i - 4} -->
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

        //testing
        //ui.alert(difficultyLevel);  return;



        // To avoid outputting empty items, only run iteration if these cells (B,C,D) contain data
        if (imageID && subViolation && difficultyLevel) {

            //check to see if date field is present - if not, the alert will be a notice
            if (!difficultyLevel == undefined) {
                ui.alert(`Please fill in all difficulty level fields in column 'D'`);
                return;

            } else if (!imageGroupID) {
                ui.alert(`Please fill in all Media Group ID fields in column 'M' 
                   These are acquired when an image is uploaded to the media manager in the CMS - 
                   If an image is unavailable: 
                   enter the placeholder image ID 263109918206505`);
                return;

            } else if (!latestDate) {
                ui.alert("Please fill in all date fields in column 'E'");
                return;

            } else {
                // Push each example item to array on each iteration in loop
                myFinalArray.push(thisResult);
            }
        }
    }

    // Remove commas after every example, convert array to string
    let myFinalArrayReplacedStr = myFinalArray.join('').toString();

    // Containing code that's required, added here, to wrap the final complete iteration of sheet
    let result =
        `
    <srt-policy>
  
      <meta name="market">${marketName}</meta>
      <meta name="violationType">${abuseType}</meta>
      <meta name="documentType">ev</meta>          
      ${myFinalArrayReplacedStr}
    
    <!-- NOTICE: If any examples are missing, please recheck the template doc to 
    make sure the relevant information is present
    // Please also check that the image for the example is uploaded to the 
    CMS media manager, and the correct 
    Media Group ID is present in the template sheet in column 'M'-->
      
    </srt-policy>  
    
    `


    // Alert final output and formatted code to screen
    ui.alert(result);


    //Logger.log(result); // Kept for future testing & maintenance purposes

}