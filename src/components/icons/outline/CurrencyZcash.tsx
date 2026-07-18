import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';
const SvgCurrencyZcash = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <Path d="M7 6h10l-10 12h10" />
    <Path d="M12 4v2" />
    <Path d="M12 18v2" />
  </Svg>
);
export default SvgCurrencyZcash;
