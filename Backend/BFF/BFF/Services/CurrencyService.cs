using BFF.Interfaces;
using BFF.Model;
using BFF.Types;

namespace BFF.Services;

public class CurrencyService : ICurrencyService
{
    private readonly ICurrencyRepository _currencyRepository;

    public CurrencyService(ICurrencyRepository currencyRepository)
    {
        _currencyRepository = currencyRepository;
    }

    public async Task<IEnumerable<CurrencyCode>> GetCurrencyCodes()
    {
        var exchangeRates = await _currencyRepository.GetMockCurrentExchangeRates();

        return exchangeRates
            .SelectMany(x => new[] { x.From, x.To })
            .Distinct();
    }

    public async Task<ExchangeRate> GetExchangeRate(CurrencyCode? from = null, CurrencyCode? to = null)
    {
        var exchangeRates = (await _currencyRepository.GetMockCurrentExchangeRates(from, to)).ToList();

        if (exchangeRates.Count == 0) throw new Exception("No exchange rates found");

        if (exchangeRates.Count > 1) throw new Exception("More than one exchange rate found");

        return exchangeRates.Single();
    }
}