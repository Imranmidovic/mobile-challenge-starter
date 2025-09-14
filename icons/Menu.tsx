import Svg, { Path } from 'react-native-svg';

export const Menu = (props: { color?: string; size?: number }) => {
  const { color, size = 24 } = props;
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M21 5H3" />
      <Path d="M15 12H3" />
    </Svg>
  );
};
