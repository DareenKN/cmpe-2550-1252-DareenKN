using System;
using System.Collections.Generic;

namespace EF_Demo_NorthWind.Models;

public partial class OrderSubtotal
{
    public int OrderId { get; set; }

    public decimal? Subtotal { get; set; }
}
