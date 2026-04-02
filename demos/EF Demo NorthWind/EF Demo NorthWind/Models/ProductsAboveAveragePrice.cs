using System;
using System.Collections.Generic;

namespace EF_Demo_NorthWind.Models;

public partial class ProductsAboveAveragePrice
{
    public string ProductName { get; set; } = null!;

    public decimal? UnitPrice { get; set; }
}
