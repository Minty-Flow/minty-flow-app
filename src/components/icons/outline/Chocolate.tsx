import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';
const SvgChocolate = (props: SvgProps) => (
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
    <Path d="M12 21v-16" />
    <Path d="M6 15h12" />
    <Path d="M6 9h10.5" />
    <Path d="M10.05 3a2.5 2.5 0 0 0 3.987 1.47a3 3 0 0 0 2.047 2.387a2.504 2.504 0 0 0 1.916 3.093v9.05a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h2.05" />
  </Svg>
);
export default SvgChocolate;
