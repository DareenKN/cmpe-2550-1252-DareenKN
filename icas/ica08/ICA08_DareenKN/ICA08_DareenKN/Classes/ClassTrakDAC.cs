using Microsoft.Data.SqlClient;

namespace ICA08_DareenKN.Classes
{
    public static class ClassTrakDAC
    {
        static string connection = "Server=data.cnt.sast.ca,24680;" +
                                    "Database=dkinganjatou1_NorthwindTraders;" +
                                    "User Id= dkinganjatou1; " +
                                    "Password=NaitKid181;" +
                                    "Encrypt=False";

        public static List<List<string>> GetEFStudents()
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

    }
}
