using Microsoft.EntityFrameworkCore;
using Pragmap.Infrastructure.Repositories.Interfaces;
using Pragmap.Infrastructure.Repositories;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Pragmap.Infrastructure.Context;

namespace Pragmap.Infrastructure.UnitOfWork
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly PragmapContext _context;
        private bool disposed = false;
        private readonly ConcurrentDictionary<Type, object> _repositories;

        public UnitOfWork(PragmapContext context)
        {
            _context = context;
            _repositories = new ConcurrentDictionary<Type, object>();
        }

        public IBaseRepository<T> GetRepository<T>() where T : class
        {
            var type = typeof(T);
            if (!_repositories.TryGetValue(type, out object? value))
            {
                value = new BaseRepository<T>(_context);
                _repositories[type] = value;
            }

            return (IBaseRepository<T>)value;
        }

        public async Task<int> Complete()
        {
            return await _context.SaveChangesAsync();
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!this.disposed)
            {
                if (disposing)
                {
                    _context.Dispose();
                }
            }
            this.disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
    }
}
