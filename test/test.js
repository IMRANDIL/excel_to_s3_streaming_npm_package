
const {getURLAfterUploadToS3} = require('../lib/index')
const ExcelJS = require('exceljs');
const { PassThrough } = require('stream');
const s3Config = {
    region: 'ap-south-1',
    credentials: {
        accessKeyId: 'AKIAQ3EGPDBCU35ORWO6',
        secretAccessKey: 'f5mI2Huq5a8q0hczDlgn9jV1GcsUPLJPeEiOgTSh'
    }
}


const getDataFromDB = async () => {
    // Replace this with your actual database fetching logic
    return [
        { name: 'John Doe', age: 30, email: 'john@example.com' },
        { name: 'Jane Doe', age: 25, email: 'jane@example.com' }
    ];
};

const testExcelToS3 = async () => {
    try {
        // Fetch data from the database
        const data = await getDataFromDB();

        // Create a new workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sheet1');

        // Add columns
        worksheet.columns = [
            { header: 'Name', key: 'name', width: 30 },
            { header: 'Age', key: 'age', width: 10 },
            { header: 'Email', key: 'email', width: 30 }
        ];

        // Add data to worksheet
        data.forEach(record => {
            worksheet.addRow(record);
        });

        // Define S3 key
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const excelDirData = 'Fatca';
        const key = `${excelDirData}/excel-${uniqueSuffix}.xlsx`;

        // Stream to S3
        const passThrough = new PassThrough();
        workbook.xlsx.write(passThrough).then(() => {
            passThrough.end();
        });

        // Await the result of getURLAfterUploadToS3
        const { success, signedURL } = await getURLAfterUploadToS3(s3Config, 'imranproject', key, passThrough, 900, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        return {
            message: 'File uploaded and streamed successfully',
            signedUrl: signedURL,
            success
        };
     
    } catch (error) {
        console.error('Error in uploading', error);
        throw error;
    }
};

(async () => {
   try {
       const { message, signedUrl, success } = await testExcelToS3();
       console.log(message, signedUrl, success);
   } catch (error) {
       console.error('Error:', error);
   }
})();
