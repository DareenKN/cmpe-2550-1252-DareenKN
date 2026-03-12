using Microsoft.Data.SqlClient;
using System.Data;

namespace ADO_DEMO.Classes
{
    public static class NorthwindDAC
    {
        static string connection = "Server=data.cnt.sast.ca,24680;" +
                                    "Database=dkinganjatou1_NorthwindTraders;" +
                                    "User Id= dkinganjatou1; " +
                                    "Password=NaitKid181;" +
                                    "Encrypt=False";

        public static List<List<string>> GetEmployees()
        {
            List<string> columnHeaders = new List<string>();
            List<List<string>> rowData = new List<List<string>>();

            using (SqlConnection conn = new SqlConnection(connection))
            {
                conn.Open();

                string query = "SELECT * FROM Employees where FirstName like 'A%'";
                using (SqlCommand comm = new SqlCommand(query, conn))
                {
                    using (SqlDataReader reader = comm.ExecuteReader())
                    {
                        for (int i = 0; i < reader.FieldCount; i++)
                            columnHeaders.Add(reader.GetName(i));
                        rowData.Add(columnHeaders);


                        while (reader.Read())
                        {
                            List<string> row = new List<string>();

                            for (int i = 0; i < reader.FieldCount; ++i)
                                row.Add(reader[i]?.ToString());
                            rowData.Add(row);
                        }
                    }

                }
            }
            return rowData;
        }

        public static List<string> GetProductInfo(int productID)
        {
            List<string> productInfo = new List<string>();

            using (SqlConnection conn = new SqlConnection(connection))
            {
                conn.Open();

                string query = "SELECT * FROM Employees where FirstName like 'A%'";
                using (SqlCommand comm = new SqlCommand(query, conn))
                {
                    comm.CommandType = CommandType.StoredProcedure;
                    comm.CommandText = "GetProduct";

                    SqlParameter pID = new SqlParameter();
                    pID.ParameterName = "@productID";
                    pID.Direction = ParameterDirection.Input;
                    pID.SqlDbType = SqlDbType.Int;
                    pID.Value = productID;
                    comm.Parameters.Add(pID);



                    using (SqlDataReader reader = comm.ExecuteReader())
                    {
                        if (reader.HasRows)
                        {
                            reader.Read();
                            for (int i = 0; i < reader.FieldCount; i++)
                                productInfo.Add(reader[i]?.ToString());
                        }
                    }

                }
            }
            return productInfo;
        }



    }
}
