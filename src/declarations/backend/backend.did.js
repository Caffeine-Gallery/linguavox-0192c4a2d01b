export const idlFactory = ({ IDL }) => {
  const Translation = IDL.Record({
    'sourceText' : IDL.Text,
    'language' : IDL.Text,
    'timestamp' : IDL.Int,
    'targetText' : IDL.Text,
  });
  return IDL.Service({
    'getTranslations' : IDL.Func([], [IDL.Vec(Translation)], ['query']),
    'saveTranslation' : IDL.Func([IDL.Text, IDL.Text, IDL.Text], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
