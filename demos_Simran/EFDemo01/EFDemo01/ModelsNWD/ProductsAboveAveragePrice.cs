using System;
using System.Collections.Generic;

namespace EFDemo01.ModelsNWD;

public partial class ProductsAboveAveragePrice
{
    public string ProductName { get; set; } = null!;

    public decimal? UnitPrice { get; set; }
}
