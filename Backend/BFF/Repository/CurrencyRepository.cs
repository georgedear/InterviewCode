using BFF.Interfaces;
using BFF.Model;
using BFF.Types;

namespace BFF.Repository;

public class CurrencyRepository : ICurrencyRepository
{
    public async Task<IEnumerable<ExchangeRate>> GetMockCurrentExchangeRates(CurrencyCode? from = null,
        CurrencyCode? to = null)
    {
        // Mock repo to provide exchange rates
        // Assumed the data comes from a single source in a particular shape that requires some manipulation
        // Assumed that the call is asynchronous and needs to be awaited
        var records = new List<ExchangeRate>
        {
            new("GBP", "GBP", 1),
            new("USD", "USD", 1),
            new("EUR", "EUR", 1),
            new("GBP", "USD", 1.3m),
            new("USD", "GBP", 0.75m),
            new("GBP", "EUR", 1.15m),
            new("EUR", "GBP", 0.85m),
            new("EUR", "USD", 1.2m),
            new("USD", "EUR", 0.7m)
            // ....
        };

        // TODO: Could change this to a queryable object
        if (from.HasValue) records = records.Where(x => x.From == from).ToList();

        if (to.HasValue) records = records.Where(x => x.To == to).ToList();

        return await Task.FromResult(records);
    }
}