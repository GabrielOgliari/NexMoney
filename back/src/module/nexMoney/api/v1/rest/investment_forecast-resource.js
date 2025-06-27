const { Op } = require("sequelize");
const dayjs = require("dayjs");
const isSameOrAfter = require("dayjs/plugin/isSameOrAfter");
const isSameOrBefore = require("dayjs/plugin/isSameOrBefore");

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

module.exports = (app) => {
  const db = app.locals.db;

  // GET /api/v1/rest/investment-forecast
  app.get("/api/v1/rest/investment-forecast", async (req, res) => {
    try {
      const { months = 6 } = req.query;
      const monthsAhead = parseInt(months);

      console.log(
        `Calculando previsão de investimentos para os próximos ${monthsAhead} meses...`
      );

      // Buscar todos os tipos de investimentos
      const [criptoData, dividendosData, fixedIncomeData, variableIncomeData] =
        await Promise.all([
          db.investimentsCripto.findAll({
            where: {
              [Op.or]: [{ exit: false }, { exit: null }],
            },
          }),
          db.investimentsDividendos.findAll(),
          db.investmentFixedIncome.findAll(),
          db.investimentsVariableIncome.findAll(),
        ]);

      console.log(
        `Dados carregados: ${criptoData.length} cripto, ${dividendosData.length} dividendos, ${fixedIncomeData.length} renda fixa, ${variableIncomeData.length} renda variável`
      );

      // Calcular histórico de investimentos dos últimos 6 meses
      const sixMonthsAgo = dayjs().subtract(6, "month");

      const investmentHistory = [
        ...criptoData.map((item) => ({
          date: item.purchaseDate,
          value: parseFloat(item.totalValue || 0),
          type: "cripto",
        })),
        ...dividendosData.map((item) => ({
          date: item.purchaseDate,
          value: parseFloat(item.totalValue || 0),
          type: "dividendos",
        })),
        ...fixedIncomeData.map((item) => ({
          date: item.startDate,
          value: parseFloat(item.value || 0),
          type: "fixed_income",
        })),
        ...variableIncomeData.map((item) => ({
          date: item.purchaseDate,
          value: parseFloat(item.totalValue || 0),
          type: "variable_income",
        })),
      ];

      // Filtrar investimentos dos últimos 6 meses
      const recentInvestments = investmentHistory.filter((item) =>
        dayjs(item.date).isAfter(sixMonthsAgo)
      );

      // Calcular média mensal
      const averageMonthlyInvestment =
        recentInvestments.length > 0
          ? recentInvestments.reduce((sum, item) => sum + item.value, 0) / 6
          : 0;

      console.log(`Média mensal de investimentos: ${averageMonthlyInvestment}`);

      // Gerar previsão para os próximos X meses
      const forecast = [];

      for (let i = 0; i < monthsAhead; i++) {
        const targetMonth = dayjs().add(i, "month");
        const monthStart = targetMonth.startOf("month");
        const monthEnd = targetMonth.endOf("month");

        // Calcular vencimentos de renda fixa no mês
        const monthlyMaturity = fixedIncomeData
          .filter((item) => {
            const dueDate = dayjs(item.dueDate);
            return (
              dueDate.isSameOrAfter(monthStart) &&
              dueDate.isSameOrBefore(monthEnd)
            );
          })
          .reduce((sum, item) => sum + parseFloat(item.value || 0), 0);

        // Projeção de novos aportes (apenas para meses futuros)
        const projectedNewInvestments = targetMonth.isAfter(dayjs())
          ? averageMonthlyInvestment
          : 0;

        forecast.push({
          month: targetMonth.format("YYYY-MM"),
          monthLabel: targetMonth.format("MMM/YYYY"),
          maturity: monthlyMaturity,
          projectedInvestments: projectedNewInvestments,
          total: monthlyMaturity + projectedNewInvestments,
          isCurrentMonth: targetMonth.isSame(dayjs(), "month"),
          isFutureMonth: targetMonth.isAfter(dayjs(), "month"),
        });
      }

      // Calcular totais de investimentos
      const totalInvested = {
        cripto: criptoData.reduce(
          (sum, item) => sum + parseFloat(item.totalValue || 0),
          0
        ),
        dividendos: dividendosData.reduce(
          (sum, item) => sum + parseFloat(item.totalValue || 0),
          0
        ),
        fixedIncome: fixedIncomeData.reduce(
          (sum, item) => sum + parseFloat(item.value || 0),
          0
        ),
        variableIncome: variableIncomeData.reduce(
          (sum, item) => sum + parseFloat(item.totalValue || 0),
          0
        ),
      };

      // Estatísticas adicionais
      const statistics = {
        averageMonthlyInvestment,
        totalInvested,
        totalInvestedSum: Object.values(totalInvested).reduce(
          (sum, value) => sum + value,
          0
        ),
        investmentCount: {
          cripto: criptoData.length,
          dividendos: dividendosData.length,
          fixedIncome: fixedIncomeData.length,
          variableIncome: variableIncomeData.length,
          total:
            criptoData.length +
            dividendosData.length +
            fixedIncomeData.length +
            variableIncomeData.length,
        },
        recentInvestmentsCount: recentInvestments.length,
        totalMaturityNext6Months: forecast.reduce(
          (sum, month) => sum + month.maturity,
          0
        ),
        totalProjectedNext6Months: forecast.reduce(
          (sum, month) => sum + month.projectedInvestments,
          0
        ),
      };

      console.log("Previsão calculada com sucesso!");

      res.json({
        success: true,
        data: {
          forecast,
          statistics,
          generatedAt: new Date().toISOString(),
          monthsAnalyzed: monthsAhead,
        },
      });
    } catch (error) {
      console.error("Erro ao calcular previsão de investimentos:", error);
      res.status(500).json({
        success: false,
        error: "Erro interno do servidor ao calcular previsão de investimentos",
        details: error.message,
      });
    }
  });

  // GET /api/v1/rest/investment-forecast/summary
  app.get("/api/v1/rest/investment-forecast/summary", async (req, res) => {
    try {
      // Buscar apenas dados básicos para um resumo rápido
      const [
        criptoCount,
        dividendosCount,
        fixedIncomeCount,
        variableIncomeCount,
      ] = await Promise.all([
        db.investimentsCripto.count({
          where: {
            [Op.or]: [{ exit: false }, { exit: null }],
          },
        }),
        db.investimentsDividendos.count(),
        db.investmentFixedIncome.count(),
        db.investimentsVariableIncome.count(),
      ]);

      // Próximos vencimentos (próximos 30 dias)
      const nextMonth = dayjs().add(1, "month").toDate();
      const upcomingMaturity = await db.investmentFixedIncome.findAll({
        where: {
          dueDate: {
            [Op.between]: [new Date(), nextMonth],
          },
        },
        attributes: ["name", "value", "dueDate"],
        order: [["dueDate", "ASC"]],
      });

      const totalUpcomingMaturity = upcomingMaturity.reduce(
        (sum, item) => sum + parseFloat(item.value || 0),
        0
      );

      res.json({
        success: true,
        data: {
          totalInvestments:
            criptoCount +
            dividendosCount +
            fixedIncomeCount +
            variableIncomeCount,
          upcomingMaturity: {
            total: totalUpcomingMaturity,
            count: upcomingMaturity.length,
            investments: upcomingMaturity.map((item) => ({
              name: item.name,
              value: parseFloat(item.value || 0),
              dueDate: item.dueDate,
              daysUntilMaturity: dayjs(item.dueDate).diff(dayjs(), "day"),
            })),
          },
          investmentTypes: {
            cripto: criptoCount,
            dividendos: dividendosCount,
            fixedIncome: fixedIncomeCount,
            variableIncome: variableIncomeCount,
          },
        },
      });
    } catch (error) {
      console.error("Erro ao buscar resumo de previsão:", error);
      res.status(500).json({
        success: false,
        error: "Erro interno do servidor ao buscar resumo",
        details: error.message,
      });
    }
  });
};
