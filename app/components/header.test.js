import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

import { Header } from './header';

test('render app', () => {
  const { getByText } = render(<Header />);
  expect(getByText('ds-annotate')).toBeInTheDocument();
});
