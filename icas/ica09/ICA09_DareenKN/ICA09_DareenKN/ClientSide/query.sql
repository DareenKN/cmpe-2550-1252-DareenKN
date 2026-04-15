use dkinganjatou1_ClassTrak
go

select *
from students
where first_name like 'E%' or first_name like 'F%'
order by first_name

select c.class_id as "Class ID",
    c.class_desc as "Class Desc",
    COALESCE(c.Days, 0) as "Days",
    FORMAT(c.start_date, 'M/d/yyyy h:mm:ss tt') as "Start Date",
    c.instructor_id as "Instructor ID",
    i.first_name as "Instructor FirstName",
    i.last_name as "Instructor LastName"
from classes c
    join instructors i
    on c.instructor_id = i.instructor_id
    join class_to_student cs
    on c.class_id = cs.class_id
where cs.student_id = 646

select *
from instructors

select * from classes

select * from class_to_student
where class_id = 99
ORDER BY student_id

