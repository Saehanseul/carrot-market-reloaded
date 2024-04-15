import React from 'react';

/**
 * 1. 전역 CSS파일들을 임포트하는 곳입니다. 통상 다음과 같은 파일들이 임포트됩니다.
 */
// import './app/globals.css'; // (예를들어 NEXT.js의 경우 이 파일이 기본 설정입니다.)
// import './src/App.css'; // (혹은 CreateViteApp을 사용하실 경우 기본 설정입니다.)
// import './styles.css'; // (기타 상황에 맞게 설정하시면 됩니다. )

/**
 * 2. 전역으로 제공되어야 하는 <Provider />들을 설정하는 곳입니다.
 *    처음부터 설정하실 필요는 없고, 컴퍼넌트 isolated rendering이 실패했을 때, 이 파일로 돌아와서 상황에 맞게 추가하시면 됩니다.
 *    몇 가지 전형적인 예시를 주석 형태로 첨부하였습니다.
 *    https://www.visualwind.dev/configuration에 보다 자세한 정보가 있습니다.
 */
export default function Wrapper({ children: YOUR_COMPONENT }: React.PropsWithChildren): React.ReactElement {
  return (
    <>
      {/* 바로 이곳에 Provider를 설정합니다. 예를 들어,*/}
      {/* <ReactQueryProvider client={queryClient}>*/}
      {/* <ReduxProvider store={reduxStore}> */}
      {/* <ThemeProvider */}
      {YOUR_COMPONENT}
      {/* </ThemeProvider */}
      {/* </ReduxProvider */}
      {/* </ReactQueryProvider */}
    </>
  );
}

/**
 * 3. 기본적인 설정이 완료되었습니다. 다음 순서는:
 *    - 이 파일을 저장하세요,
 *    - 리액트 컴퍼넌트 파일을 열어보세요,
 *    - 우측 위에 푸른배경의 화살표 아이콘이 보일 거에요. 클릭하시면 렌더링됩니다.
 */
