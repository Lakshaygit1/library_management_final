export const plans = [
    {
        id: 1,
        name: "Basic",
        price: "$10/month",
        features: [
            "Request to issue 1 ebook per month",
            "Can only read ebooks (no downloads)",
        ],
        request_available: 1,
        view_pdf: true,
        download_pdf: false,
    },
    {
        id: 2,
        name: "Standard",
        request_available: 5,
        price: "$20/month",
        features: [
            "Request to issue up to 5 ebooks per month",
            "Can only view ebooks (no downloads)",
        ],
        view_pdf: true,
        download_pdf: false,
    },
    {
        id: 3,
        name: "Premium",
        request_available: 10000,
        price: "$30/month",
        features: [
            "Request to issue up to Unlimited ebooks per month",
            "Can download PDF of ebooks",
        ],
        view_pdf: true,
        download_pdf: true,
    },
];
