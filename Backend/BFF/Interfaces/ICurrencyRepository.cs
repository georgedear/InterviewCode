using BFF.Model;
using BFF.Types;

namespace BFF.Interfaces;

public interface ICurrencyRepository
{
    Task<IEnumerable<ExchangeRate>> GetMockCurrentExchangeRates(CurrencyCode? from = null, CurrencyCode? to = null);
}