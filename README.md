## React-Wizard

This is the latest in my series of headless components; it is a system designed to manager a react wizard with as much
freedom as possible as to how you lay out and use it. 

To create a wizard you:

1. Wrap you component in a `<Wizard>...</Wizard>` tag, that puts the wizardContext into context;
2. Inside the Wizard tag, put your Controller which defines the nature of your wizard: 
   * Add two or more Page instances to the WizardContext: 
```javascript
    wizardContext.addPages([
        new Page("first", "First Page", {
      order: 1,
      data: [ new Data("name", "User Name", '', {required: true} )]
    }), // ...
    ]);
// ...
```

3. In the render method / View function, render the view of your Wizard. For pages that have unusual layouts/features
   you can define the page's view component in page.View.

```jsx harmony
  const {prevPage, nextPage, goToPageId, currentPage} = wizardContext;
  if (!currentPage) return '';
  const  View = currentPage.View || PageView;

  return (
    <Layout>
      <Head>
        <h1>The Great Tree of Wizards! </h1>
        <h2>{currentPage.title}</h2>
      </Head>
      <Navigation goToPageId={goToPageId}/>
      <View page={currentPage}/>
      <Foot>
        <div>{prevPage && "previous: " + prevPage.id}</div>
        <div>{nextPage && "next: " + nextPage.id}</div>
        {prevPage && <button onClick={wizardContext.goPrev}>Prev</button>}
        {nextPage && (
          <button onClick={wizardContext.goNext}>Next</button>
        )}
      </Foot>
    </Layout>
  );
```

4. Inside your page view class, render the data. This is a *very simple* example but it shows the basic pattern
   note, you can pull in the wizardContext in page view if you heed data beyond what the page provides. 
   
```jsx harmony
export default ({ page }) => {
  if (!page) {
    return "";
  }
  const {data, title } = page;
  return (
    <Page>
      <table>
        <tbody>
          {[...data.values()].map((data) => {
            const Input = data.Input || DataInput;
            return (
              <tr key={data.id}>
                <td>{data.label}</td>
                <td>
                  <Input page={page} data={data} />
                </td>
                <td>
                  {data.required ? '* required' : ''}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Page>
  );
};
```

## Technical note: React Wizard uses immer

immer, the new immutable, creates change-resistant structures. This is good for react and bad for you if you can't 
figure out how to change them. Wizard does have several functions tgo allow you update you pages, data, etc.
but if you want to expand the dataler you'll have to read the immer docs to learn how to update the structures.

### Page Fields and Organization

Pages can be a flat list, or heirarchical. You can create "unvisitable" page groups by flagging the canGoTo property
to false. 

The most important properties are:

```
id {string} a unique identifier
order {number} a sorting queue - shoud also be unique
title {string} the displayed name of the pae
data: {[Data]} a set of field/value objects for data collected by the page
```

Page has some properties that by default are computed, but can be set to either
a true or false value, or a function that computes a true/false value based on
the page: 

```
canGoTo: {boolean/function} -- whether the page is reachable; if for instance 
                               its a heirarchical section that contains other pages 
                               setting canGoTo to false enables that.
isComplete{boolean/function} -- if not set, it is the summation of the completeness state
                               of all the data; or if none exist is true. 
                               You can set this is a function that is only true if the 
                               data are 
```