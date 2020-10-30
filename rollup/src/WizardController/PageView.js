import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import ControlInput from '../ControlInput';

const Page = styled.div`
  grid-row-start: row-content-start;
  grid-row-end: row-foot-start;
  grid-column-start: col-content-start;
  grid-column-end: cal-footer-start;
  background-color: pink;
`;

export default ({ page }) => {
  if (!page) {
    return '';
  }
  const { controls, title } = page;
  return (
    <Page>
      <table>
        <tbody>
          {[...controls.values()].map((control) => (
            <tr key={control.id}>
              <td>{control.label}</td>
              <td>
                <ControlInput page={page} control={control} />
              </td>
              <td>
                {control.required ? '* required' : ''}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Page>
  );
};
