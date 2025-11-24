function FAQPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold mb-4">Frequently Asked Questions</h1>

      <div className="collapse collapse-arrow bg-base-100 shadow">
        <input type="checkbox" />
        <div className="collapse-title text-lg font-medium">
          What does this app do?
        </div>
        <div className="collapse-content">
          <p className="text-sm opacity-80">
            This app lets you upload a shopping receipt, extracts the product
            names using OCR and AI, and checks them against recent Canadian
            recall notices from the last few days.
          </p>
        </div>
      </div>

      <div className="collapse collapse-arrow bg-base-100 shadow">
        <input type="checkbox" />
        <div className="collapse-title text-lg font-medium">
          Where does the recall data come from?
        </div>
        <div className="collapse-content">
          <p className="text-sm opacity-80">
            Recall information is pulled from the official Government of Canada
            recall dataset, which includes recent food and consumer product
            recalls.
          </p>
        </div>
      </div>

      <div className="collapse collapse-arrow bg-base-100 shadow">
        <input type="checkbox" />
        <div className="collapse-title text-lg font-medium">
          Do you store my receipts or personal data?
        </div>
        <div className="collapse-content">
          <p className="text-sm opacity-80">
            No. Receipts are processed only to extract item names and are tied
            to a temporary session. The session is cleared shortly after you
            view your results.
          </p>
        </div>
      </div>

      <div className="collapse collapse-arrow bg-base-100 shadow">
        <input type="checkbox" />
        <div className="collapse-title text-lg font-medium">
          Is this an official recall checker?
        </div>
        <div className="collapse-content">
          <p className="text-sm opacity-80">
            This is a personal project that uses public data. It is not an
            official government tool. Always verify recalls using the official
            Government of Canada resources.
          </p>
        </div>
      </div>
    </div>
  );
}

export default FAQPage;