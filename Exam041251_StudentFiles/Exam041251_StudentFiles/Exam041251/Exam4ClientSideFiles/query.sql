use dkinganjatou1_restaurantdb
go 

select
    i.itemId as "ItemId",
    i.itemName as "Item Name",
    i.itemPrice as "Price",
    Sum(CONVERT(money,(coalesce(o.itemCount,0) * i.itemPrice)))  as "Total Revenvue"
    
from items i
left outer join orders o
    on i.itemId = o.itemid
where o.orderdate between '2025-06-08' and '2026-07-08' or i.itemid = i.itemid and o.orderdate is null
group by i.itemid, i.itemName, i.itemPrice

select * from items
select * from orders

INSERT INTO items (itemid, itemName, itemPrice) VALUES (7, 'TestItem', 1)

UPDATE items SET itemName = 'change', itemPrice = 6 WHERE itemid = 7

DELETE FROM items WHERE itemid = 7

select
