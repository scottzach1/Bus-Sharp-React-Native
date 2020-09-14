import React, {Component} from "react";
import {Badge, Card, ListItem, ThemeProvider} from "react-native-elements";
import {StackNavigationProp} from "@react-navigation/stack";
import {ScrollView, StyleSheet} from "react-native";
import {View} from "../Themed";

const theme = {
    colors: {
        platform: {
            "default": {
                "grey": "#FFF"
            }
        }
    }
};

interface Props {
    navigation: StackNavigationProp<any>,
    stopData: any | null | undefined,
    errorMessage: string | null,
}

interface State {
    showHours: boolean,
}

class StopTimetable extends Component<Props, State> {
    constructor(props: Readonly<Props>) {
        super(props);

        this.state = {
            showHours: true,
        }
    }

    getHoursRemaining(arrivalTime: string) {
        const arrivalDate: Date = new Date(arrivalTime);
        const currentDate: Date = new Date();

        let timeRemaining: number | string = Math.round((arrivalDate.getTime() - currentDate.getTime()) / 60000);
        return (timeRemaining < 0) ? 'due' : timeRemaining + ' mins';
    }

    getTime(arrivalTime: string) {
        const arrivalDate: Date = new Date(arrivalTime);
        const dateTimeFormat = new Intl.DateTimeFormat('en', {
            month: 'short',
            day: '2-digit',
            hour: 'numeric',
            minute: 'numeric'
        });
        return dateTimeFormat.format(arrivalDate);
    }

    generateStops() {
        if (!this.props.stopData) return undefined;

        let services: any[] = this.props.stopData.Services;
        let listItems: any[] = [];

        services.sort(function (a: { AimedArrival: number; }, b: { AimedArrival: number; }) {
            return a.AimedArrival - b.AimedArrival;
        });

        let counter = 0;
        for (const service of services) {
            // Parse the time information from the response json.

            const serviceName: string[] = service.Service.Name.split("-");
            const serviceCode: string = service.ServiceID;
            const isLive: boolean = service.IsRealtime;
            let badgeSpacing = "";
            for (let i = serviceCode.length; i < 3; ++i) badgeSpacing += " ";
            const timeRemaining: string = (this.state.showHours) ?
                this.getHoursRemaining(service.AimedArrival) : this.getTime(service.AimedArrival);

            listItems.push(
                <ListItem
                    key={'stop-card-' + counter++}
                    // onPress={() => this.props.navigation.navigate("SearchServiceScreen", {code: serviceCode})}
                    onPress={() => document.location.href = '/search/service/' + serviceCode}
                    bottomDivider
                >
                    <Badge status={"warning"} value={serviceCode}/>
                    <ListItem.Content>
                        <ListItem.Title>{badgeSpacing}{serviceName[0]}</ListItem.Title>
                        <ListItem.Subtitle>{badgeSpacing}{timeRemaining}</ListItem.Subtitle>
                    </ListItem.Content>
                    {isLive && <Badge status={"success"} value={"live"}/>}
                </ListItem>
            )
        }

        return <>{listItems}</>;
    }

    render() {
        console.log('stop data', this.props.stopData);

        return (
            <ThemeProvider theme={theme}>
                <Card>
                    <Card.Title>Upcoming Services</Card.Title>
                    <View style={styles.listCard}>
                        <Card.Divider/>
                        <ScrollView>
                            {this.generateStops()}
                        </ScrollView>
                    </View>
                </Card>
            </ThemeProvider>
        );
    }
}

const styles = StyleSheet.create({
    listCard: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        height: '50vh',
    }
})

export default StopTimetable;