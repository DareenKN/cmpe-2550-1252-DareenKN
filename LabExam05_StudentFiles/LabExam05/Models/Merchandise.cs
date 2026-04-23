using System;
using System.Collections.Generic;

namespace LabExam05.Models;

public partial class Merchandise
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Category { get; set; } = null!;

    public decimal Price { get; set; }

    public int Stock { get; set; }
}
