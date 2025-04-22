import sql from 'msnodesqlv8';

const connectDB = () => {
  return new Promise((resolve, reject) => {
    const connectionString =
      "Driver={ODBC Driver 17 for SQL Server};Server=DESKTOP-S5BN1G9\\SQLEXPRESS;Database=SuperVet;Trusted_Connection=Yes;";
    
    sql.open(connectionString, (err, conn) => {
      if (err) {
        console.error("Error connecting to the database:", err);
        reject(err); 
      } else {
        console.log("Connected to the database!");
        resolve(conn);
      }
    });
  });
};

export default connectDB;
