using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace AuthenticationServer.Models.Entities;

public partial class AppUser
{
    [Key]
    public Guid Id { get; set; }

    [StringLength(50)]
    public string UserName { get; set; } = null!;

    [StringLength(256)]
    public string PasswordHash { get; set; } = null!;

    public string RefreshToken { get; set; } = null!;
}
