using Microsoft.Data.SqlClient;

namespace ICA09_DareenKN.Classes
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

        public static List<List<string>> GetEFStudents()
        //public static List<Student> GetEFStudents()
        {
            List<string> columnHeaders = new List<string>();
            List<List<string>> rowData = new List<List<string>>();

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
                        for (int i = 0; i < reader.FieldCount; i++)
                            columnHeaders.Add(reader.GetName(i));
                        rowData.Add(columnHeaders);


                        while (reader.Read())
                        {
                            List<string> row = new List<string>();

                            for (int i = 0; i < reader.FieldCount; ++i)
                                row.Add(reader[i].ToString() ?? "NULL");
                            rowData.Add(row);

                            //Student s = new Student
                            //{
                            //    student_id = reader.GetInt32(0),
                            //    first_name = reader.GetString(1),
                            //    last_name = reader.GetString(2),
                            //    school_id = reader.GetInt32(3)
                            //};

                            //_students.Add(s);
                        }
                    }

                }

            }
            return rowData;
            //return _students;
        }

        public static List<string> GetClassIds()
        {
            List<string> rowData = new List<string>();

            using (SqlConnection conn = new SqlConnection(connection))
            {
                conn.Open();
                string query = "SELECT class_desc FROM classes";

                using (SqlCommand comm = new SqlCommand(query, conn))
                {
                    using (SqlDataReader reader = comm.ExecuteReader())
                    {
                        while (reader.Read())
                            rowData.Add(reader[0].ToString() ?? "NULL");

                    }
                }
            }
            return rowData;
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
                                row.Add(reader[i]?.ToString() ?? "NULL");
                            rowData.Add(row);
                        }
                    }

                }
            }

            return rowData;
        }

        public static int DeleteStudent(int st_id)
        {
            int result = 0;
            using (SqlConnection conn = new SqlConnection(connection))
            {
                conn.Open();

                string query1 = $"DELETE FROM class_to_student WHERE student_id = @stid";
                string query2 = $"DELETE FROM results WHERE student_id = @stid";
                string query3 = $"DELETE FROM students WHERE student_id = @stid";

                try
                {
                    using (SqlCommand comm = new SqlCommand(query1, conn))
                    {
                        comm.Parameters.AddWithValue("@stid", st_id);
                        comm.ExecuteNonQuery();
                    }
                    using (SqlCommand comm = new SqlCommand(query2, conn))
                    {
                        comm.Parameters.AddWithValue("@stid", st_id);
                        comm.ExecuteNonQuery();
                    }
                    using (SqlCommand comm = new SqlCommand(query3, conn))
                    {
                        comm.Parameters.AddWithValue("@stid", st_id);
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

        public static int UpdateStudent(int st_id, string fn, string ln, int schId)
        {
            int result = 0;

            using (SqlConnection conn = new SqlConnection(connection))
            {
                conn.Open();
                string query =
                    "UPDATE students " +
                    @"SET last_name = @ln, first_name = @fn, school_id = @schId " +
                    @"WHERE student_id = @stid";

                try
                {
                    using (SqlCommand comm = new SqlCommand(query, conn))
                    {
                        comm.Parameters.AddWithValue("@stid", st_id);
                        comm.Parameters.AddWithValue("@ln", ln);
                        comm.Parameters.AddWithValue("@fn", fn);
                        comm.Parameters.AddWithValue("@schId", schId);
                        try
                        {
                            int rows = comm.ExecuteNonQuery();
                            if (rows == 0) result = -1;
                        }catch(Exception ex) { throw new Exception(ex.Message); }
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

        public static int AddStudent(string fn, string ln, int schId, string[] classDescs, out int st_id)
        {
            int result = 0;

            using (SqlConnection conn = new SqlConnection(connection))
            {
                conn.Open();
                SqlTransaction trans = conn.BeginTransaction();
                st_id = 0;

                try
                {
                    // 1. Insert student + get generated ID
                    SqlCommand insertStudent = new SqlCommand(
                        "INSERT INTO students (last_name, first_name, school_id) " +
                        "VALUES (@ln, @fn, @schId); " +
                        "SELECT SCOPE_IDENTITY();",
                        conn, trans
                    );

                    insertStudent.Parameters.AddWithValue("@ln", ln);
                    insertStudent.Parameters.AddWithValue("@fn", fn);
                    insertStudent.Parameters.AddWithValue("@schId", schId);

                    st_id = Convert.ToInt32(insertStudent.ExecuteScalar());

                    if (st_id <= 0)
                    {
                        trans.Rollback();
                        return -1;
                    }

                    // 2. Loop through class descriptions
                    if (classDescs != null)
                    {
                        foreach (var desc in classDescs)
                        {
                            // 🔍 Get class_id from class_desc
                            SqlCommand getClassId = new SqlCommand(
                                "SELECT class_id FROM classes WHERE class_desc = @desc",
                                conn, trans
                            );
                            getClassId.Parameters.AddWithValue("@desc", desc);

                            object resultObj = getClassId.ExecuteScalar();

                            if (resultObj == null)
                                continue; // class not found

                            int classId = Convert.ToInt32(resultObj);

                            // Check if relation exists
                            SqlCommand checkCmd = new SqlCommand(
                                "SELECT COUNT(*) FROM class_to_student WHERE student_id = @stid AND class_id = @cid",
                                conn, trans
                            );
                            checkCmd.Parameters.AddWithValue("@stid", st_id);
                            checkCmd.Parameters.AddWithValue("@cid", classId);

                            int exists = (int)checkCmd.ExecuteScalar();

                            if (exists > 0)
                                continue;

                            // Insert relation
                            SqlCommand insertClass = new SqlCommand(
                                "INSERT INTO class_to_student (student_id, class_id) VALUES (@stid, @cid)",
                                conn, trans
                            );
                            insertClass.Parameters.AddWithValue("@stid", st_id);
                            insertClass.Parameters.AddWithValue("@cid", classId);

                            int rows = insertClass.ExecuteNonQuery();
                            if (rows <= 0)
                            {
                                trans.Rollback();
                                return -1;
                            }
                        }
                    }

                    // success
                    trans.Commit();
                    result = st_id; // return the new student ID (better than just 1)
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


        //public static int AddStudent(string fn, string ln, int schId, string[] classIds)
        //{
        //    int result = 0;

        //    using (SqlConnection conn = new SqlConnection(connection))
        //    {
        //        conn.Open();

        //        string query =
        //            "INSERT INTO students (last_name, first_name, school_id)" +
        //            "VALUES (@ln, @fn, @schId)";

        //        try
        //        {
        //            using (SqlCommand comm = new SqlCommand(query, conn))
        //            {
        //                comm.Parameters.AddWithValue("@ln", ln);
        //                comm.Parameters.AddWithValue("@fn", fn);
        //                comm.Parameters.AddWithValue("@schId", schId);
        //                int rows = comm.ExecuteNonQuery();
        //                if (rows == 0) result = -1;
        //            }

        //        }
        //        catch (ArgumentException ex)
        //        {
        //            Console.WriteLine(ex.Message);
        //            result = -1;
        //            return -1;
        //        }

        //        // Find the student ID : select student_id from students where last_name like 'Dareen' and first_name like 'Kinga'

        //        foreach (var classId in classIds)
        //        {
        //            int check = (int)new SqlCommand($"SELECT 1 FROM class_to_student WHERE student_id = {st_id} AND class_id = {classId}", conn).ExecuteScalar();

        //            if (check > 0)
        //                continue;

        //            string query2 =
        //               "INSERT INTO class_to_student (student_id, class_id)" +
        //               "VALUES (@stid, @classId)";

        //            using (SqlCommand comm = new SqlCommand(query2, conn))
        //            {
        //                comm.Parameters.AddWithValue("@stid", st_id);
        //                comm.Parameters.AddWithValue("@classId", classId);
        //                int rows = comm.ExecuteNonQuery();
        //                if (rows < 1) result = -1;
        //            }

        //        }
        //    }

        //    return result;
        //}

    }
}

//SqlCommand cmd = new SqlCommand(
//    "SELECT COUNT(*) FROM students WHERE student_id = @id", conn
//);
//cmd.Parameters.AddWithValue("@id", st_id);

//int check1 = (int)cmd.ExecuteScalar();