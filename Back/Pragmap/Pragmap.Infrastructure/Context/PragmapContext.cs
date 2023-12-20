using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pragmap.Infrastructure.Context
{
    public class PragmapContext : DbContext
    {
        public PragmapContext(DbContextOptions<PragmapContext> options) : base(options)
        {
        }
    }
}
