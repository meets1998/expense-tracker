import StyledComponentsRegistry from '@/lib/registry';
import Providers from '@/components/Providers';

export const metadata = {
  title: 'ExpenseWise - Smart Expense Tracking',
  description: 'Track your expenses with ease and elegance',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <StyledComponentsRegistry>
          <Providers>
            {children}
          </Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}