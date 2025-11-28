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
            Upload a receipt, we extract item names, and check them against recent Canadian recall notices from the last few days.
          </p>
        </div>
      </div>

        <div className="collapse collapse-arrow bg-base-100 shadow">
        <input type="checkbox" />
        <div className="collapse-title text-lg font-medium">
          Do you store my receipts or data?
        </div>
        <div className="collapse-content">
          <p className="text-sm opacity-80">
            No. Receipts are processed for a temporary session to extract item names and check recalls, then discarded.
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
         Where can I find official recalled product list
        </div>
        <div className="collapse-content">
          <p className="text-sm opacity-80">
           <a href="https://recalls-rappels.canada.ca/en" target="_blank">https://recalls-rappels.canada.ca/en</a>
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
            No, it uses public Government of Canada data but is not an official tool. Always verify on the official site.
          </p>
        </div>
      </div>

      <div className="collapse collapse-arrow bg-base-100 shadow">
        <input type="checkbox" />
        <div className="collapse-title text-lg font-medium">
          Developer Information / Contact
        </div>
        <div className="collapse-content">
          <p className="text-sm opacity-80">
        <a href="https://ekamsingh.ca" target="_blank">Ekam Singh Bhatia</a>

          </p>
        </div>
      </div>

     
    </div>

    
    
  );
}

export default FAQPage;