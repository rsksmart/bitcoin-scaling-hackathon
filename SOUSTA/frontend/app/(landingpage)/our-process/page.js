export default function OurProcess() {
  return (
    <>
      <main className="flex flex-col items-center justify-between p-24">
        <div className="flex flex-col gap-8 max-w-prose">
          <h1 className="font-semibold text-4xl">
            Artificial Intelligence in Multifamily Real Estate Investment
            Analysis
          </h1>
          <p>
            Investing in multifamily real estate involves analyzing multiple
            complex factors simultaneously to assess the potential for
            profitable returns. Today, Artificial Intelligence (AI) has the
            potential to automate and streamline this process, providing SOUSTA
            with comprehensive, data-driven insights for superior
            decision-making.
          </p>
          <h2 className="font-semibold text-3xl">SOUSTA Analytical Process</h2>
          <p>
            Our multifamily real estate investment assessment process involves
            four main steps which involve a point system combined with a
            potential growth multiplier:
          </p>
          <ol className="flex flex-col gap-4 list-decimal pl-8">
            <li key={1}>
              <span className="font-semibold">
                Assessing Market Conditions (1-350 points):
              </span>{' '}
              Includes evaluating the economic stability, population and
              demographic trends, and the balance of supply and demand in a
              given market.
            </li>
            <li key={2}>
              <span className="font-semibold">
                Analyzing Property Specifics (1-350 points):
              </span>{' '}
              Encompasses evaluating the cash flow potential of the property,
              its physical condition, and location-specific factors.
            </li>
            <li key={3}>
              <span className="font-semibold">
                Evaluating Financial Metrics (1-300 points):
              </span>{' '}
              Consists of reviewing the capitalization rate, cash on cash
              return, and debt service coverage ratio.
            </li>
            <li key={4}>
              <span className="font-semibold">
                Growth Potential (Multiplier: 1-100):
              </span>{' '}
              Considers future demographic growth, future employment trends, and
              planned infrastructure and development in the area to estimate the
              property's growth potential. The total from steps 1-3 is
              multiplied by the Growth Potential score.
            </li>
          </ol>
          <h2 className="font-semibold text-3xl">
            The Role of AI in Real Estate Assessment
          </h2>
          <p>
            AI significantly augments this assessment process by analyzing vast
            amounts of data quickly and accurately, predicting trends, and
            automating complex calculations.
          </p>
          <h2 className="font-semibold text-3xl">
            Data Aggregation and Analysis
          </h2>
          <p>
            AI automates the gathering and analysis of data related to market
            conditions, property specifics, and financial metrics from a myriad
            of sources. It can process diverse data types, including text,
            numbers, images, and more.
          </p>
          <h2 className="font-semibold text-3xl">Predictive Analytics</h2>
          <p>
            AI, in conjunction with machine learning algorithms, identifies
            patterns in historical data to forecast future demographic and
            employment trends, predict shifts in supply and demand, and assesses
            the potential impact of planned infrastructure on property values.
          </p>
          <h2 className="font-semibold text-3xl">Risk Assessment</h2>
          <p>
            By examining variables such as local economic conditions, property
            conditions, and financial metrics, AI calculates the potential risks
            associated with a particular investment, helping to make more
            informed decisions.
          </p>
          <h2 className="font-semibold text-3xl">
            Growth Potential Evaluation
          </h2>
          <p>
            Through the use of predictive analytics, AI assesses the Growth
            Potential of a property. It can project population growth, predict
            future job trends, and analyze planned developments, providing a
            comprehensive multiplier score.
          </p>
          <h2 className="font-semibold text-3xl">
            Geographic Information System (GIS) Integration
          </h2>
          <p>
            AI can be integrated with GIS to visualize and analyze
            location-specific data, such as access to amenities, neighborhood
            demographics, and proximity to economic hubs.
          </p>
          <h2 className="font-semibold text-3xl">Property Recommendations</h2>
          <p>
            Based on the gathered data and calculated scores, AI suggests
            potential properties for investment that match SOUSTA's strategy and
            risk tolerance.
          </p>
          <p>
            AI provides a robust tool for multifamily property analysis. It can
            automate time-consuming tasks, provide predictive insights, and
            support informed, data-driven decision-making. While AI can
            significantly enhance the property selection process, it's essential
            to remember that it is used as a decision-support tool and not a
            replacement for human judgment and expertise. AI-generated insights
            are best utilized with experienced real estate knowledge and due
            diligence.
          </p>
        </div>
      </main>
    </>
  )
}
