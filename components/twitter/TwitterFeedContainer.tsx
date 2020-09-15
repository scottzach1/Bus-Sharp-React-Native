import React, {useEffect} from "react";
import {View} from "react-native";

const TwitterFeedContainer = () => {
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://platform.twitter.com/widgets.js";
        getTwitterContainer().appendChild(script);
    }, []);

    // Gets the parent container of the Twitter timeline 'a' tag.
    function getTwitterContainer() {
        return document.getElementsByClassName("twitter-timeline")[0].parentNode!
    }

    // Keep listening until the element is rendered, before manipulating overflow and max-width property.
    async function styleFrame(maxAttempts: number, counter?: number) {
        try {
            // Unfortunately using `.setAttribute` wont work here. So we have to manually manipulate the objects styles.

            // @ts-ignore - Add a scrollbar by manipulating the overflow property in DOM.
            getTwitterContainer().style.overflow = 'auto';

            let iframe = document.getElementById('twitter-widget-0')
            // @ts-ignore - Remove content max-width by manipulating the maxWidth property in DOM.
            iframe.contentWindow.document.getElementsByClassName('timeline-Widget')[0].style.maxWidth = 'none'
        } catch {
            // Component wasn't actually ready, try again in a second.
            if (counter && counter >= maxAttempts) return;
            setTimeout(() => styleFrame(maxAttempts, (counter) ? counter + 1 : 1), 500)
        }
    }

    // Try for 20 seconds before giving up.
    styleFrame(20).catch((e) => console.error('Failed to add scrollbar to the embed widget', e));

    // Dark theme preference.
    const prefersDark: boolean = window.matchMedia('(prefers-color-scheme: dark)').matches;

    return (
        <View>
            <a
                className="twitter-timeline"
                data-theme={(prefersDark) ? "dark" : "light"}
                data-chrome="noheader nofooter noborders transparent"
                href="https://twitter.com/metlinkwgtn"
            >
                Tweets by metlinkwgtn
            </a>
        </View>
    );
};

export default TwitterFeedContainer;