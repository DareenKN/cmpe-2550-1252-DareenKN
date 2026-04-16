use dkinganjatou1_RestaurantDB
GO

SELECT c.customer_id AS "Customer ID",
    c.first_name AS "First Name",
    c.last_name AS "Last Name",
    o.order_id AS "Order ID",
    o.order_date AS "Order Date",
    l.location_name AS "Location Name"
FROM customers c
    JOIN orders o
    ON c.customer_id = o.customer_id
    JOIN locations l
    ON o.location_id = l.location_id
WHERE c.first_name = 'John' AND c.last_name = 'Doe'

select * from customers
select * from locations
SELECT * from orders
SELECT * from items
SELECT * FROM customers

SELECT * FROM itemsOffered

SELECT 
    o.orderid AS "Order ID",
    o.orderdate AS "Order Date",
    o.paymentmethod AS "Payment Method",
    i.itemname AS "Item Name",
    i.itemprice AS "Item Price",
    o.itemCount AS "Item Count"
    from orders o
    join items i
    on o.itemid = i.itemid
    join locations l
    on o.locationid = l.locationid
WHERE o.cid = 100 AND l.locationName = 'Nait Campus'
