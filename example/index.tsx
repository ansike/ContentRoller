import * as React from 'react';
import 'react-app-polyfill/ie11';
import { createRoot } from 'react-dom/client';
import { ContentRoller } from '../.';

const App = () => {
  return (
    <div>
      <ContentRoller
        messages={[
          '1 this is a long message this is a long message this is a long message this is a long message 1',
          '2 this is a long message this is a long message 2',
          '3 this is a long message 3',
          '4 this is a long message 4',
          '5 this is a long message 5',
          '6 this is a long message 6',
          '7 this is a long message 7',
          '8 this is a long message',
          '9 this is a long message',
          '10 this is a long message',
        ]}
      />
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
