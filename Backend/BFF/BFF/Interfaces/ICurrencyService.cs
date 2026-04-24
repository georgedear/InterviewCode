using BFF.Model;
using BFF.Types;

namespace BFF.Interfaces;

public interface ICurrencyService
{
    Task<IEnumerable<CurrencyCode>> GetCurrencyCodes();
    Task<ExchangeRate> GetExchangeRate(CurrencyCode? from, CurrencyCode? to);
}