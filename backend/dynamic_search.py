import sys
import pprint
from collections import OrderedDict
from places import get_state, get_city
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker, declarative_base

Base = declarative_base()

class States(Base):
    __tablename__ = 'states'
    id = Column(Integer, primary_key=True)
    city = Column(String)
    state_short = Column(String)
    state_full = Column(String)
    county = Column(String)


class DynamicSearch:

    def __init__(self):
        self.engine = create_engine('sqlite:///american_cities.db')
        self.Session = sessionmaker(bind=self.engine)
        self.prev = []

    def search(self, query):
        if query == "":
            return None

        res_cities = self.search_cities(query)
        res_states = self.search_cities(query)
        res_counties = self.search_counties(query)
        ans = OrderedDict()
        if res_cities or res_states or res_counties:
            for loc in res_cities:
                if loc.county not in ans:
                    ans[loc.county] = [loc.city, loc.state_short, loc.state_full]
            for loc in res_counties:
                if loc.county not in ans:
                    ans[loc.county] = [loc.city, loc.state_short, loc.state_full]
            for loc in res_cities:
                if loc.county not in ans:
                    ans[loc.county] = [loc.city, loc.state_short, loc.state_full]

        self.prev.append(query)
        if not ans:
            return None
        ans = self._reorganize(ans)

        return ans

    def _reorganize(self, places):
        # user_city = get_city().lower()
        user_state = get_state()
        if user_state is None:
            return places
        else:
            user_state = user_state.lower()

        ans = OrderedDict()

        for county, lst in places.items():
            city = lst[0]
            state_short = lst[1]
            state = lst[2]

            if state.lower() == user_state:
                ans[county] = [city, state_short, state]

        for county, lst in places.items():
            city = lst[0]
            state_short = lst[1]
            state = lst[2]

            if state.lower() != user_state:
                ans[county] = [city, state_short, state]

        return ans

    # def c_search(self, query, prev=None):
    #     if query == "":
    #         return None
    #
    #     if prev is None:
    #         prev = self.prev
    #
    #     res_cities = self.search_cities("".join(prev + [query]))
    #     res_states = self.search_cities("".join(prev + [query]))
    #     res_counties = self.search_counties("".join(prev + [query]))
    #     ans = {}
    #     if res_cities or res_states or res_counties:
    #         for city in res_cities:
    #             if city.county not in ans:
    #                 ans[city.county] = [city.city, city.state_full]
    #         for county in res_counties:
    #             if county.county not in ans:
    #                 ans[county.county] = [county.city, county.state_full]
    #         for state in res_cities:
    #             if state.county not in ans:
    #                 ans[state.county] = [state.city, state.state_full]
    #
    #     self.prev.append(query)
    #     if not ans:
    #         return None
    #
    #     return ans

    def clear_hist(self):
        self.prev = []

    def cont_search(self):
        try:
            while True:
                query = input("Search for: ")
                if query == "":
                    continue
                results = self.search_cities(query)
                if results:
                    print("Results: ")
                    for state in results:
                        print(f'{state.city}, {state.state_full} ({state.county})')
                else:
                    print('No results found')
        except:
            print('\nExisting search...')
            sys.exit()

    def search_cities(self, query):
        session = self.Session()
        results = session.query(States).filter(States.city.like(f'%{query}%')).limit(10).all()
        session.close()
        return results

    def search_states(self, query):
        session = self.Session()
        results = session.query(States).filter(States.state_full.like(f'%{query}%')).limit(10).all()
        session.close()
        return results

    def search_counties(self, query):
        session = self.Session()
        results = session.query(States).filter(States.county.like(f'%{query}%')).limit(10).all()
        session.close()
        return results
