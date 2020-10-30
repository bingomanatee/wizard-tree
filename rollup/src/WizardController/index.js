import React, {
  useState, useEffecct, useContext, useEffect,
} from 'react';
import styled from 'styled-components';
import Control from '../Control';
import PageView from './PageView';
import WizardContext from '../WizardContext';
import Navigation from './Navigation';

const Layout = styled.article`
  display: grid;
  grid-template-rows: [row-start] 60px [row-content-start] 1fr [row-foot-start] 60px[row-end];
  grid-template-columns: [col-start] 200px [col-content-start] 1fr 1fr[col-end];
  height: 100%;
  width: 100%;
`;

const Head = styled.section`
grid-column-start: col-start;
grid-column-end: col-end;
grid-row-start: row-start;
grid-row-end: row-content-start;
display: flex;
flex-direction: row;
justify-content: center;
align-items: baseline;
h1, h2 {
font-size: 1.5em;
padding: 0;
margin: 1rem 2rem;
}
`;

const Foot = styled.footer`
grid-column-start: 2;
grid-column-end: 3;
grid-row-start: 3;
grid-row-end: 3;
display: flex;
flex-direction: row;
justify-content: space-around;
align-items: center;
`;

export default ({}) => {
  const wizardContext = useContext(WizardContext);

  useEffect(() => {
    console.log('wizardContext: ', wizardContext);
  }, [wizardContext]);

  useEffect(() => {
    wizardContext.addPage('first', 'First Page', {
      order: 1,
      controls: [new Control('name', 'User Name', '', { required: true })],
    });
    wizardContext.addPage('next', 'Section', {
      order: 2,
      canGoTo: false,
    });
    wizardContext.addPage(
      'the one where Rachel marries Ross',
      'Friends Page',
      {
        order: 3,
        parent: 'next',
        controls: [new Control('alpha', 'Alpha Field'), new Control('beta', 'Beta Field', '', { required: true })],
      },
    );
    wizardContext.addPage('last', 'Last Page', {
      order: 4,
      controls: [new Control('delta', 'Delta Field', '', { required: true }), new Control('omega', 'Omega Field')],
    });

    wizardContext.addPage('summary', 'Summary', { order: 5 });
  }, []);

  if (!wizardContext) return '';

  const {
    prevPage, nextPage, goToPageId, currentPage,
  } = wizardContext;
  if (!currentPage) return '';
  const View = currentPage.View || PageView;

  return (
    <Layout>
      <Head>
        <h1>The Great Tree of Wizards! </h1>
        <h2>{currentPage.title}</h2>
      </Head>
      <Navigation goToPageId={goToPageId} />
      <View page={currentPage} />
      <Foot>
        <div>{prevPage && `previous: ${prevPage.id}`}</div>
        <div>{nextPage && `next: ${nextPage.id}`}</div>
        {prevPage && <button onClick={wizardContext.goPrev}>Prev</button>}
        {nextPage && (
          <button onClick={wizardContext.goNext}>Next</button>
        )}
      </Foot>
    </Layout>
  );
};
