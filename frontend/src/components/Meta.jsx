import { Helmet } from 'react-helmet-async';

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keyword' content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: 'Welcome To AgriMart',
  description: 'We sell the best farming products for cheap',
  keywords: 'farming, seeds, fertilizers, pesticides, tools',
};

export default Meta;
