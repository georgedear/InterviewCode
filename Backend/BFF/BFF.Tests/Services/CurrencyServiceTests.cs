using BFF.Interfaces;
using BFF.Model;
using BFF.Services;
using BFF.Types;
using FluentAssertions;
using NSubstitute;
using Xunit;

namespace BFF.Tests.Services;

public class CurrencyServiceTests
{
    private readonly ICurrencyRepository _currencyRepository;
    private readonly CurrencyService _currencyService;

    public CurrencyServiceTests()
    {
        _currencyRepository = Substitute.For<ICurrencyRepository>();
        _currencyService = new CurrencyService(_currencyRepository);
    }

    [Fact]
    public async Task GetCurrencyCodes_ReturnsCodesFromBothFromAndToFields()
    {
        // Arrange
        var exchangeRates = new List<ExchangeRate>
        {
            new(new CurrencyCode("USD"), new CurrencyCode("GBP"), 0.79m),
            new(new CurrencyCode("EUR"), new CurrencyCode("JPY"), 160.5m)
        };

        _currencyRepository.GetMockCurrentExchangeRates().Returns(exchangeRates);

        // Act
        var result = await _currencyService.GetCurrencyCodes();

        // Assert
        result.Should().BeEquivalentTo(new[]
        {
            new CurrencyCode("USD"),
            new CurrencyCode("GBP"),
            new CurrencyCode("EUR"),
            new CurrencyCode("JPY")
        });
    }

    [Fact]
    public async Task GetCurrencyCodes_DeduplicatesCurrencyCodes()
    {
        // Arrange
        var exchangeRates = new List<ExchangeRate>
        {
            new(new CurrencyCode("USD"), new CurrencyCode("GBP"), 0.79m),
            new(new CurrencyCode("USD"), new CurrencyCode("EUR"), 0.92m)
        };

        _currencyRepository.GetMockCurrentExchangeRates().Returns(exchangeRates);

        // Act
        var result = await _currencyService.GetCurrencyCodes();

        // Assert
        result.Should().BeEquivalentTo(new[]
        {
            new CurrencyCode("USD"),
            new CurrencyCode("GBP"),
            new CurrencyCode("EUR")
        });
    }

    [Fact]
    public async Task GetCurrencyCodes_WhenNoExchangeRates_ReturnsEmpty()
    {
        // Arrange
        _currencyRepository.GetMockCurrentExchangeRates().Returns(new List<ExchangeRate>());

        // Act
        var result = await _currencyService.GetCurrencyCodes();

        // Assert
        result.Should().BeEmpty();
    }

    [Fact]
    public async Task GetCurrencyCodes_CallsRepositoryExactlyOnce()
    {
        // Arrange
        _currencyRepository.GetMockCurrentExchangeRates().Returns(new List<ExchangeRate>());

        // Act
        await _currencyService.GetCurrencyCodes();

        // Assert
        await _currencyRepository.Received(1).GetMockCurrentExchangeRates();
    }

    [Fact]
    public async Task GetExchangeRate_ReturnsSingleExchangeRate()
    {
        // Arrange
        var from = new CurrencyCode("USD");
        var to = new CurrencyCode("GBP");
        var expectedRate = new ExchangeRate(from, to, 0.79m);

        _currencyRepository.GetMockCurrentExchangeRates(from, to)
            .Returns(new List<ExchangeRate> { expectedRate });

        // Act
        var result = await _currencyService.GetExchangeRate(from, to);

        // Assert
        Assert.Equivalent(expectedRate, result);
    }

    [Fact]
    public async Task GetExchangeRate_WhenNoExchangeRatesFound_ThrowsExceptionWithCorrectMessage()
    {
        // Arrange
        var from = new CurrencyCode("USD");
        var to = new CurrencyCode("GBP");

        _currencyRepository.GetMockCurrentExchangeRates(from, to).Returns(new List<ExchangeRate>());

        // Act
        var action = () => _currencyService.GetExchangeRate(from, to);

        // Assert
        var exception = await Assert.ThrowsAsync<Exception>(action);
        Assert.Equal("No exchange rate found", exception.Message);
    }

    [Fact]
    public async Task GetExchangeRate_WhenMultipleExchangeRatesFoundForSelection_ThrowsExceptionWithCorrectMessage()
    {
        // Arrange
        var from = new CurrencyCode("USD");
        var to = new CurrencyCode("GBP");
        var rates = new List<ExchangeRate> { new(from, to, 0.79m), new(from, to, 0.81m) };

        _currencyRepository.GetMockCurrentExchangeRates(from, to).Returns(rates);

        // Act
        var action = () => _currencyService.GetExchangeRate(from, to);

        // Assert
        var exception = await Assert.ThrowsAsync<Exception>(action);
        Assert.Equal("More than one exchange rate found", exception.Message);
    }

    [Fact]
    public async Task GetExchangeRate_WithNullParameters_PassesNullsToRepository()
    {
        // Arrange
        _currencyRepository.GetMockCurrentExchangeRates().Returns(new List<ExchangeRate>
        {
            new(new CurrencyCode("USD"), new CurrencyCode("GBP"), 0.79m)
        });

        // Act
        await _currencyService.GetExchangeRate();

        // Assert
        await _currencyRepository.Received(1).GetMockCurrentExchangeRates();
    }

    [Fact]
    public async Task GetExchangeRate_CallsRepositoryExactlyOnce()
    {
        // Arrange
        var from = new CurrencyCode("USD");
        var to = new CurrencyCode("GBP");
        var rates = new List<ExchangeRate> { new(from, to, 0.79m) };

        _currencyRepository.GetMockCurrentExchangeRates(from, to).Returns(rates);

        // Act
        await _currencyService.GetExchangeRate(from, to);

        // Assert
        await _currencyRepository.Received(1).GetMockCurrentExchangeRates(from, to);
    }
}