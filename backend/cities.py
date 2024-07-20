import csv
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker, declarative_base
from time import time

Base = declarative_base()

class States(Base):
    __tablename__ = 'states'
    id = Column(Integer, primary_key=True)
    city = Column(String)
    state_short = Column(String)
    state_full = Column(String)
    county = Column(String)

def load_data(file):
    with open(file, newline='', encoding='utf-8') as f:
        return list(csv.DictReader(f))

if __name__ == '__main__':
    t = time()

    engine = create_engine('sqlite:///american_cities.db')
    Base.metadata.create_all(engine)

    Session = sessionmaker(bind=engine)
    with Session() as session:
        try:
            file_name = 'american_cities.csv'
            data = load_data(file_name)
            for item in data:
                record = States(city=item['City'], state_short=item['State short'],
                                state_full=item['State full'], county=item['County'])
                session.add(record)
            session.commit()
        except Exception as e:
            session.rollback()
            print(f"Error occurred: {e}")
        finally:
            session.close()

    print("Time elapsed: " + str(time() - t) + " s.")
