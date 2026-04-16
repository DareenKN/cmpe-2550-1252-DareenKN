using Microsoft.Data.SqlClient;

namespace Exam041251
{
    public class RestaurantDAC
    {
        static string connection = "Server=data.cnt.sast.ca,24680;" +
                                    "Database=dkinganjatou1_RestaurantDB;" +
                                    "User Id= dkinganjatou1; " +
                                    "Password=NaitKid181;" +
                                    "Encrypt=False";

        public class Item
        {
            public int itemId { get; set; }
            public string? itemName { get; set; }
            public double itemPrice { get; set; }
            public decimal totalRevenue { get; set; }
        }

        //public static List<Item> GetItemsInfo(string stDate, string endDate)
        public static List<Item> GetItemsInfo(string stDate, string endDate)
        {
            List<string> columnHeaders = new List<string>();
            List<List<string>> rowData = new List<List<string>>();

            List<Item> _students = new List<Item>();

            using (SqlConnection conn = new SqlConnection(connection))
            {
                conn.Open();

                string query =
                    "select\r\n" +
                    "    i.itemId as \"ItemId\",\r\n" +
                    "    i.itemName as \"Item Name\",\r\n" +
                    "    i.itemPrice as \"Price\",\r\n" +
                    "    Sum(CONVERT(money,(coalesce(o.itemCount,0) * i.itemPrice)))  as \"Total Revenvue\"\r\n" +
                    "    \r\nfrom items i\r\nleft outer join orders o\r\n" +
                    "    on i.itemId = o.itemid\r\n" +
                    "where o.orderdate between @stDate and @endDate or i.itemid = i.itemid and o.orderdate is null\r\ngroup by i.itemid, i.itemName, i.itemPrice";

                using (SqlCommand comm = new SqlCommand(query, conn))
                {
                    comm.Parameters.AddWithValue("@stDate", stDate);
                    comm.Parameters.AddWithValue("@endDate", endDate);
                    using (SqlDataReader reader = comm.ExecuteReader())
                    {
                        for (int i = 0; i < reader.FieldCount; i++)
                            columnHeaders.Add(reader.GetName(i));
                        rowData.Add(columnHeaders);


                        while (reader.Read())
                        {
                            List<string> row = new List<string>();

                            for (int i = 0; i < reader.FieldCount; ++i)
                                row.Add(reader[i].ToString() ?? "NULL");
                            rowData.Add(row);

                            Item x = new Item
                            {
                                itemId = reader.GetInt32(0),
                                itemName = reader.GetString(1),
                                itemPrice = reader.GetDouble(2),
                                totalRevenue = reader.GetDecimal(3)
                            };

                            _students.Add(x);
                        }
                    }

                }

            }
            return _students;
        }


        public static int DeleteItem(int id, out string message)
        {
            int result = 0;
            message = "";
            using (SqlConnection conn = new SqlConnection(connection))
            {
                conn.Open();

                string query = $"select 1 from itemsOffered where itemid = @id";
                SqlCommand check = new SqlCommand(query, conn);
                check.Parameters.AddWithValue("@id", id);

                //int check1 = (int)check.ExecuteScalar();

                //if (check1 == 0)
                //{
                //    message = "The item is offered";
                //    return -1;
                //}

                string query1 = $"DELETE FROM items WHERE itemid = @id";


                try
                {
                    using (SqlCommand comm = new SqlCommand(query1, conn))
                    {
                        comm.Parameters.AddWithValue("@id", id);
                        comm.ExecuteNonQuery();
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                    result = -1;
                }
                ;
            }

            return result;
        }

        public static int UpdateItem(int id, string name, double price)
        {
            int result = 0;

            using (SqlConnection conn = new SqlConnection(connection))
            {
                conn.Open();
                string query =
                    "UPDATE items SET itemName = @name, itemPrice = @price WHERE itemid = @id";

                try
                {
                    using (SqlCommand comm = new SqlCommand(query, conn))
                    {

                        comm.Parameters.AddWithValue("@id", id);
                        comm.Parameters.AddWithValue("@name", name);
                        comm.Parameters.AddWithValue("@price", price);
                        int rows = comm.ExecuteNonQuery();
                        if (rows == 0) result = -1;
                    }

                }
                catch (ArgumentException ex)
                {
                    Console.WriteLine(ex.Message);
                    result = -1;
                }

            }

            return result;
        }

        public static int AddItem(int id, string name, double price)
        {
            int result = 0;

            using (SqlConnection conn = new SqlConnection(connection))
            {
                conn.Open();
                SqlTransaction trans = conn.BeginTransaction();

                try
                {
                    // 1. Insert student + get generated ID
                    SqlCommand insertItem = new SqlCommand(
                        "INSERT INTO items (itemid, itemName, itemPrice) VALUES (@id, @name, @price)",
                        conn, trans
                    );

                    insertItem.Parameters.AddWithValue("@id", id);
                    insertItem.Parameters.AddWithValue("@name", name);
                    insertItem.Parameters.AddWithValue("@price", price);

                    int rows = insertItem.ExecuteNonQuery();
                    if (rows <= 0)
                    {
                        trans.Rollback();
                        return -1;
                    }

                    // success
                    trans.Commit();
                    result = 1; // return the new item ID (better than just 1)
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                    trans.Rollback();
                    result = -1;
                }
            }

            return result;
        }
    }
}


//int check1 = (int)cmd.ExecuteScalar();