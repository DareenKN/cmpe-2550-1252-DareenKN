using System.Text.RegularExpressions;
using ICA11_DareenKN.Models;

namespace ICA11_DareenKN
{
    public class Program
    {
        public static string CleanInput(string input)
        {
            string cleanInput = Regex.Replace(input, "<.*?|&.*?;", string.Empty);
            return cleanInput;
        }




        public static void Main(string[] args)
        {
            Console.WriteLine("ICA11 DareenKN For Debbuging Purposes");

            var builder = WebApplication.CreateBuilder(args);
            builder.Services.AddControllers();
            var app = builder.Build();

            app.UseCors(x => x.AllowAnyMethod().AllowAnyHeader().SetIsOriginAllowed(origin => true));

            app.MapGet("/", () => "ASP.NET CORE ICA10 DareenKN");

            app.MapGet("/Welcome", () => "Welcome to Tim Hortons");

            app.MapPost("/Location", (Info l) =>
            {
                Console.WriteLine("Inside Locations");

                using (var db = new Dkinganjatou1RestaurantDbContext())
                {
                    var locations = db.Locations
                                      .Select(x => x.LocationName)
                                      .ToList();
                    string message = $"Retrieved {locations.Count} location(s)";


                    return Results.Ok(new { locations = locations, message = message });
                }
            });

            app.MapGet("/GetOrders/{Cid?}/{lName}", (int? Cid, string lName) =>
            {
                Console.WriteLine("Inside GetOrders");
                Console.WriteLine($"{Cid} {lName}");

                if (Cid == null)
                    return Results.Ok(new { messsage = $"No ID was provided" });

                if (string.IsNullOrEmpty(lName))
                    return Results.Ok(new { message = $"No Location was provided" });

                using (var db = new Dkinganjatou1RestaurantDbContext())
                {
                    /*
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
                     */
                    var orders = db.Orders
                                    .Where(x => x.Cid == Cid && x.Location.LocationName == lName)
                                    .Select(x => new
                                    {
                                        OrderId = x.OrderId,
                                        OrderDate = x.OrderDate,
                                        PaymentMethod = x.PaymentMethod,
                                        ItemName = x.Item.ItemName,
                                        ItemPrice = x.Item.ItemPrice,
                                        ItemCount = x.ItemCount
                                    })
                                    .ToList();
                    string message = "", error = "";
                    var custumername = db.Customers
                                         .Where(x => x.Cid == Cid)
                                         .Select(x => $"{x.Fname} {x.Lname}")
                                         .ToList().FirstOrDefault();
                    if (custumername == null)
                        return Results.Ok(new { error = $"Customer with ID {Cid} not found" });

                    if (orders.Count > 0)
                        message = $"Orders placed by {custumername} at Location: {lName}";
                    else
                        error = $"Couldn't retrieve order info for {custumername} at Location {lName}";

                    return Results.Ok(new { message = message, error = error, orders = orders });
                }
            });

            app.MapGet("/Menu/{loc}", (string loc) =>
            {
                Console.WriteLine("Inside Menu");

                using (var db = new Dkinganjatou1RestaurantDbContext())
                {
                    var menu = db.ItemsOffereds
                                 .Where(x => x.OfferedStatus && x.Location.LocationName == loc)
                                 .Select(x => new
                                 {
                                     item = x.Item.ItemName,
                                     price = x.Item.ItemPrice
                                 })
                                 .ToList();
                    string message = $"Retrieved {menu.Count} items";
                    return Results.Ok(new { menu = menu, message = message });
                }
            });

            app.MapGet("/PaymentMethods/{loc}", (string loc) =>
            {
                Console.WriteLine("Inside PaymentMethod");

                using (var db = new Dkinganjatou1RestaurantDbContext())
                {
                    var paymentMethod = db.Orders
                                          .Where(x => x.Location.LocationName == loc)
                                          .Select(x => x.PaymentMethod)
                                          .Distinct()
                                          .ToList();
                    string message = $"Retrieved {paymentMethod.Count} payment Methods";
                    return Results.Ok(new { paymentMethods = paymentMethod, message = message });
                }
            });

            app.MapPost("/Order", (Info i) =>
            {
                Console.WriteLine("Inside Order");

                string time = "";
                Random randTime = new Random();
                var orderPlaced = new string[] { };


                if (i.Cid == null)
                    return Results.Ok(new { error = "No customer ID has been provided" });

                if (string.IsNullOrEmpty(i.item))
                    return Results.Ok(new { error = "No item was selected" });

                if (i.itemsNum == 0)
                    return Results.Ok(new { error = "The number of items can't be equal to zero" });

                if (string.IsNullOrEmpty(i.payment))
                    return Results.Ok(new { error = "No payment method has been provided" });


                using (var db = new Dkinganjatou1RestaurantDbContext())
                {
                    var exists = db.Customers.Any(x => x.Cid == i.Cid);

                    if (!exists)
                        return Results.Ok(new { error = $"{i.Cid} is not a valid customer" });


                    var item = db.Items
                                    .Where(x => x.ItemName == i.item)
                                    .Select(x => new { x.Itemid, x.ItemPrice })
                                    .FirstOrDefault();

                    if (item == null)
                        return Results.Ok(new { error = "Invalid item" });


                    var locationId = db.Locations
                                        .Where(x => x.LocationName == i.location)
                                        .Select(x => x.Locationid)
                                        .FirstOrDefault();

                    var o = new Order
                    {
                        Cid = (int)i.Cid,
                        Locationid = locationId,
                        Itemid = item.Itemid,
                        ItemCount = i.itemsNum,
                        PaymentMethod = i.payment,
                        OrderDate = DateTime.Now
                    };


                    var total = item.ItemPrice * i.itemsNum;

                    try
                    {
                        db.Orders.Add(o);
                        db.SaveChanges();
                    }
                    catch (Exception ex) { return Results.Problem(ex.Message); }

                    orderPlaced =
                    [
                        $"Pick up Location: {i.location}",
                        $"Item Ordered: {i.item}",
                        $"Number of Items: {i.itemsNum}",
                        $"Method of Payment: {i.payment}",
                        $"Net Balance: {total:C}"
                    ];
                    time = $"Your order will be ready for pickup in {randTime.Next(1, 31)} minute(s)";

                    return Results.Ok(new { time = time, order = orderPlaced });
                }
;
            });

            app.Run();
        }

        record Info(string location, int? Cid, string item, int itemsNum, string payment);
    }
}
