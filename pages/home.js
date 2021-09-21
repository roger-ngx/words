import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { isEmpty } from 'lodash';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Annotation from 'components/annotation';
import Classification from 'components/classification';
import PageWithDrawer from 'components/PageWithDrawer';
import { useRouter } from 'next/router';

const Home = () => {

    const [ currentComponent, setCurrentComponent ] = useState();
    const [ currentTab, setCurrentTab ] = useState(0);

    const router = useRouter();

    useEffect(() => {
        const currentUser = (typeof window === undefined) ? '' : localStorage.getItem('currentUser');

        if(isEmpty(currentUser)){
            router.push('/');
            return;
        }
    }, []);

    useEffect(() => {
        switch (currentTab) {
            case 0:
                setCurrentComponent(<Classification />);
                break;

            case 1:
                setCurrentComponent(<Annotation />);
                break;
        }
    }, [currentTab]);

    return (
        <React.Fragment>
            <Head>
                <title>Words</title>
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
            </Head>
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <div style={{minWidth: 150}}>
                    <PageWithDrawer />
                </div>
                <div style={{flex: 1}}>
                    <Paper square style={{position: 'sticky', top: 0, width: '100%', zIndex: 1000}}>
                        <Tabs
                            value={currentTab}
                            indicatorColor="primary"
                            textColor="primary"
                            onChange={(e, value) => setCurrentTab(value)}
                            aria-label="disabled tabs example"
                        >
                            <Tab label="Classification" />
                            <Tab label="NER" />
                            <Tab label="Q&A" />
                            <Tab label="MER" />
                        </Tabs>
                    </Paper>
                    <div style={{marginTop: 32}}>
                        {currentComponent}
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Home;