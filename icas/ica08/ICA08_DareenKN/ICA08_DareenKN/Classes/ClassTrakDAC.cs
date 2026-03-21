using Microsoft.Data.SqlClient;

namespace ICA08_DareenKN.Classes
{
    public static class ClassTrakDAC
    {
        static string connection = "Server=data.cnt.sast.ca,24680;" +
                                    "Database=dkinganjatou1_ClassTrak;" +
                                    "User Id= dkinganjatou1; " +
                                    "Password=NaitKid181;" +
                                    "Encrypt=False";

        public class Student
        {
            public int student_id { get; set; }
            public string? first_name { get; set; }
            public string? last_name { get; set; }
            public int school_id { get; set; }
        }

        //public static List<List<string>> GetEFStudents()
        public static List<Student> GetEFStudents()
        {
            //List<string> columnHeaders = new List<string>();
            //List<List<string>> rowData = new List<List<string>>();

            List<Student> _students = new List<Student>();

            using (SqlConnection conn = new SqlConnection(connection))
            {
                conn.Open();

                string query = "SELECT * from students " +
                               "WHERE first_name LIKE 'E%' OR first_name LIKE 'F%' " +
                               "ORDER BY first_name";

                using (SqlCommand comm = new SqlCommand(query, conn))
                {
                    using (SqlDataReader reader = comm.ExecuteReader())
                    {
                        //for (int i = 0; i < reader.FieldCount; i++)
                        //    columnHeaders.Add(reader.GetName(i));
                        //rowData.Add(columnHeaders);


                        while (reader.Read())
                        {
                            //List<string> row = new List<string>();

                            //for (int i = 0; i < reader.FieldCount; ++i)
                            //    row.Add(reader[i]?.ToString());
                            //rowData.Add(row);

                            Student s = new Student
                            {
                                student_id = reader.GetInt32(0),
                                first_name = reader.GetString(1),
                                last_name = reader.GetString(2),
                                school_id = reader.GetInt32(3)
                            };

                            _students.Add(s);
                        }
                    }

                }

            }
            //return rowData;
            return _students;
        }

        public static List<List<string>> GetStudentClassInfo(int stid)
        {
            List<string> columnHeaders = new List<string>();
            List<List<string>> rowData = new List<List<string>>();

            using (SqlConnection conn = new SqlConnection(connection))
            {
                conn.Open();

                string query = "select c.class_id as 'Class ID', " +
                                        "c.class_desc as 'Class Desc', " +
                                        "COALESCE(c.Days, 0) as 'Days', " +
                                        "FORMAT(c.start_date, 'M/d/yyyy h:mm:ss tt') as 'Start Date', " +
                                        "c.instructor_id as 'Instructor ID', " +
                                        "i.first_name as 'Instructor FirstName', " +
                                        "i.last_name as 'Instructor LastName' " +
                                "from classes c " +
                                "    join instructors i " +
                                "    on c.instructor_id = i.instructor_id " +
                                "    join class_to_student cs " +
                                "    on c.class_id = cs.class_id " +
                                "where cs.student_id = @stid ";

                using (SqlCommand comm = new SqlCommand(query, conn))
                {
                    comm.Parameters.AddWithValue("@stid", stid);

                    using (SqlDataReader reader = comm.ExecuteReader())
                    {
                        //for (int i = 0; i < reader.FieldCount; i++)
                        //    columnHeaders.Add(reader.GetName(i));
                        //rowData.Add(columnHeaders);


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
