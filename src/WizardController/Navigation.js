import React, { useContext } from 'react';
import sortBy from 'lodash.sortby';
import styled from 'styled-components';
import WizardContext from '../WizardContext';

const TreeRoot = styled.ul`
margin: 0;
padding: 0;
list-style: none;
> li > ul {
margin-left: 10px;
}
`;

const TreeItem = styled.li`

`;
const TreeItemTitle = styled.h3`
  background-color: ${({ page }) => ((page.canGoTo === false) ? 'white' : 'lightBlue')};
  color: ${({ canGoTo }) => (canGoTo ? 'blue' : 'grey')};
`;

const Title = ({ canGoTo, onClick, page }) => (
  <TreeItemTitle canGoTo={canGoTo} page={page}>
    {canGoTo && onClick ? <a onClick={onClick}>{page.title}</a> : page.title}
  </TreeItemTitle>
);

const Tree = ({ pagesYouCanGoToIDs, root }) => {
  const { pageList, goToPageId } = useContext(WizardContext);

  const myPages = pageList.filter((page) => (root ? page.parent === root : !page.parent));
  if (!myPages.length) return '';
  return (
    <TreeRoot>
      {myPages.map((page) => {
        const canGoTo = pagesYouCanGoToIDs.includes(page.id);
        const onClick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (
            canGoTo && (page.canGoTo !== false)
          ) goToPageId(page.id);
        };
        return (
          <TreeItem page={page} key={page.id}>
            <Title onClick={onClick} canGoTo={canGoTo} page={page} />
            <Tree pagesYouCanGoToIDs={pagesYouCanGoToIDs} root={page.id} />
          </TreeItem>
        );
      })}
    </TreeRoot>
  );
};

const Root = styled.nav`
grid-column-start: col-start;
grid-column-end: col-content-start;
grid-row-start: row-content-start;
grid-row-end: row-end;
background-color: aqua;
`;

export default () => {
  const wizardContext = useContext(WizardContext);
  const {
    pageList, currentPage, goToPageId, pagesYouCanGoTo,
  } = wizardContext;

  if (!(pageList && currentPage)) return null;
  return (
    <Root>
      <Tree pagesYouCanGoToIDs={pagesYouCanGoTo.map((page) => page.id)} />
    </Root>
  );
};
