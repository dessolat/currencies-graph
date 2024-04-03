import { type TOPTIONS } from './types';

import cl from './Graph.module.scss';
import clsx from 'clsx';

type Props = {
  OPTIONS: TOPTIONS;
};

const Layout = ({ OPTIONS }: Props) => {
  const { WIDTH, HEIGHT, LEFT_OFFSET, BOTTOM_OFFSET, RIGHT_OFFSET, TOP_OFFSET } = OPTIONS;

  return (
    <>
      {/* X axis */}
      <line
        x1={LEFT_OFFSET}
        x2={WIDTH - RIGHT_OFFSET}
        y1={HEIGHT - BOTTOM_OFFSET}
        y2={HEIGHT - BOTTOM_OFFSET}
        stroke='gray'
      />

      {/* Y axis */}
      <line
        x1={LEFT_OFFSET}
        x2={LEFT_OFFSET}
        y1={TOP_OFFSET}
        y2={HEIGHT - BOTTOM_OFFSET}
        stroke='gray'
      />

      {/* Y Title */}
      <text x={LEFT_OFFSET} y={TOP_OFFSET - 5} className={clsx(cl.title, cl.text)}>
        Рубли
      </text>

      {/* X Title */}
      <text x={WIDTH - RIGHT_OFFSET} y={HEIGHT - BOTTOM_OFFSET + 14} className={clsx(cl.title, cl.text)}>
        Дата
      </text>
    </>
  );
};
export default Layout;
