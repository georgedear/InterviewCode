using System.ComponentModel.DataAnnotations;
using BFF.Dtos;
using BFF.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BFF.Controllers;

[ApiController]
[Route("[controller]")]
public class CurrencyController : ControllerBase
{
    private readonly ICurrencyService _currencyService;

    public CurrencyController(ICurrencyService currencyService)
    {
        _currencyService = currencyService;
    }

    [HttpGet("GetCurrencyCodes")]
    public async Task<IEnumerable<string>> GetCurrencyCodes()
    {
        var currencyCodes = await _currencyService.GetCurrencyCodes();
        return currencyCodes.Select(x => x.Value);
    }

    [HttpGet("GetExchangeRate")]
    public async Task<ExchangeRateDto> GetExchangeRate([FromQuery] [Required] string from,
        [FromQuery] [Required] string to)
    {
        var exchangeRate = await _currencyService.GetExchangeRate(from, to);
        return new ExchangeRateDto(exchangeRate.From.Value, exchangeRate.To.Value, exchangeRate.Rate);
    }
}