# Scandoo

Just a simple scanner app. Built with Next.js and MongoDB for looking up and managing products.

Uses [`@yudiel/react-qr-scanner`](https://github.com/yudiel/react-qr-scanner) to handle the barcode/QR scanning. It's a solid library that supports pretty much every format you'd need - QR codes, Code 128, EAN, PDF417, etc.

## Setup

You'll need:
- Node.js 16+
- MongoDB running somewhere (local or MongoDB Atlas)

```bash
npm install
```

Create `.env.local`:
```
MONGODB_URI=<your-mongo-database-uri>
```

Then just run:
```bash
npm run dev
```

## How to Use

- **Scan**: Point your camera at a barcode or QR code and it'll automatically detect it
- **Manual entry**: Type a code in manually if you don't want to scan
- **Create products**: Add new products with a code, title, and price
- **Edit**: Update existing products

## Stack

- Next.js 16 + React 19
- TypeScript
- Tailwind CSS
- MongoDB + Mongoose
- @yudiel/react-qr-scanner

##

Feel free to take this and make it your own. Change the database, the UI, add more features, whatever. It's just a starting point. The scanning part works well thanks to the library, so focus on what makes sense for your use case.

## License

Do whatever you want with it
